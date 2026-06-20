// =============================================================================
// Dashboard — Page Component
// =============================================================================
// Displays a responsive dashboard with:
//   • Quick statistics cards (Total Products, Meals Scheduled this Week, Today's Menu).
//   • Today's Menu Timeline, sorted by Time Slot (Breakfast -> Lunch -> Dinner).
//   • Loading states and empty states with action buttons.
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getSchedules } from '../planner/api/scheduleApi';
import { getProducts } from '../products/api/productApi';
import type { Schedule, Product, TimeSlot } from '../../types';
import { BookOpen, CalendarCheck, Clock, Utensils, Sunrise, Sun, Moon, UtensilsCrossed, LayoutDashboard } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIME_SLOT_ORDER: Record<TimeSlot, number> = {
  Breakfast: 0,
  Lunch: 1,
  Dinner: 2,
};

const TIME_SLOT_ICONS: Record<TimeSlot, React.ComponentType<{ className?: string }>> = {
  Breakfast: Sunrise,
  Lunch: Sun,
  Dinner: Moon,
};

const TIME_SLOT_COLORS: Record<TimeSlot, { bg: string; text: string; border: string }> = {
  Breakfast: {
    bg: 'bg-aboitiz-sand/15',
    text: 'text-aboitiz-earth font-semibold',
    border: 'border-aboitiz-sand/30',
  },
  Lunch: {
    bg: 'bg-aboitiz-secondary/20',
    text: 'text-aboitiz-textDark font-semibold',
    border: 'border-aboitiz-secondary/40',
  },
  Dinner: {
    bg: 'bg-aboitiz-primary/10',
    text: 'text-aboitiz-primary font-semibold',
    border: 'border-aboitiz-primary/20',
  },
};

/** Checks if a date string (YYYY-MM-DD) falls within the current week (Sunday to Saturday) */
function isSameWeek(dateStr: string): boolean {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();

  // Reset now to beginning of day
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Calculate current Sunday
  const currentSunday = new Date(today);
  currentSunday.setDate(today.getDate() - today.getDay());
  
  // Calculate current Saturday
  const currentSaturday = new Date(currentSunday);
  currentSaturday.setDate(currentSunday.getDate() + 6);

  // Normalize target date
  const targetDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  return targetDate >= currentSunday && targetDate <= currentSaturday;
}

export default function DashboardPage() {
  const navigate = useNavigate();

  // ─── Data Fetching ─────────────────────────────────────────────────────────

  const {
    data: schedules = [],
    isLoading: isSchedulesLoading,
    isError: isSchedulesError,
    error: schedulesError,
  } = useQuery<Schedule[]>({
    queryKey: ['schedules'],
    queryFn: getSchedules,
  });

  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // ─── Calculations ──────────────────────────────────────────────────────────

  // Today's date in local YYYY-MM-DD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // Filter & sort today's meals
  const todaysMeals = schedules
    .filter((s) => s.scheduledDate.split('T')[0] === todayStr)
    .sort((a, b) => TIME_SLOT_ORDER[a.timeSlot] - TIME_SLOT_ORDER[b.timeSlot]);

  // Statistics
  const totalProducts = products.length;
  const scheduledThisWeek = schedules.filter((s) =>
    isSameWeek(s.scheduledDate.split('T')[0])
  ).length;
  const todaysMealsCount = todaysMeals.length;

  const isLoading = isSchedulesLoading || isProductsLoading;
  const isError = isSchedulesError || isProductsError;

  // ─── Loading State ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <svg
          className="animate-spin h-10 w-10 text-aboitiz-secondary mb-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm font-medium text-aboitiz-primary animate-pulse">
          Gathering your nutrition updates...
        </p>
      </div>
    );
  }

  // ─── Error State ───────────────────────────────────────────────────────────

  if (isError) {
    const errMsg =
      (schedulesError instanceof Error ? schedulesError.message : '') ||
      (productsError instanceof Error ? productsError.message : 'An unexpected error occurred.');

    return (
      <div className="bg-aboitiz-danger/10 border border-aboitiz-danger/20 rounded-2xl p-6 text-center max-w-lg mx-auto mt-8">
        <p className="text-aboitiz-danger font-semibold text-lg">Failed to load Dashboard data</p>
        <p className="text-sm text-aboitiz-danger/80 mt-2">{errMsg}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-aboitiz-danger text-white rounded-xl text-sm font-semibold hover:bg-aboitiz-danger/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ─── Render Page ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-8" id="dashboard-page">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-semibold text-aboitiz-textDark flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-aboitiz-primary" />
          Dashboard
        </h1>
        <p className="text-sm text-aboitiz-primary mt-1">
          Welcome back. Here is your overview and meal schedule for today,{' '}
          <span className="font-semibold">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          .
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="dashboard-stats-grid">
        {/* Stat 1: Total Products */}
        <div
          id="stat-card-products"
          onClick={() => navigate('/products')}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-aboitiz-primary/10 p-5
                     shadow-sm hover:shadow-md hover:-translate-y-0.5
                     transition-all duration-200 cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
              Product Catalog
            </p>
            <p className="text-3xl font-bold text-aboitiz-textDark group-hover:text-aboitiz-earth transition-colors">
              {totalProducts}
            </p>
            <p className="text-[11px] text-aboitiz-primary/80">
              Ingredients configured
            </p>
          </div>
          <div className="bg-aboitiz-secondary/15 p-3 rounded-2xl text-aboitiz-primary/80 group-hover:bg-aboitiz-secondary/25 transition-colors flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-aboitiz-primary" />
          </div>
        </div>

        {/* Stat 2: Scheduled this week */}
        <div
          id="stat-card-weekly-schedules"
          onClick={() => navigate('/planner')}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-aboitiz-primary/10 p-5
                     shadow-sm hover:shadow-md hover:-translate-y-0.5
                     transition-all duration-200 cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
              Planned This Week
            </p>
            <p className="text-3xl font-bold text-aboitiz-textDark group-hover:text-aboitiz-earth transition-colors">
              {scheduledThisWeek}
            </p>
            <p className="text-[11px] text-aboitiz-primary/80">
              Weekly scheduled meals
            </p>
          </div>
          <div className="bg-aboitiz-secondary/15 p-3 rounded-2xl text-aboitiz-primary/80 group-hover:bg-aboitiz-secondary/25 transition-colors flex items-center justify-center">
            <CalendarCheck className="w-8 h-8 text-aboitiz-primary" />
          </div>
        </div>

        {/* Stat 3: Today's scheduled meals */}
        <div
          id="stat-card-today-schedules"
          onClick={() => navigate('/planner')}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-aboitiz-primary/10 p-5
                     shadow-sm hover:shadow-md hover:-translate-y-0.5
                     transition-all duration-200 cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <p className="text-xs font-semibold text-aboitiz-primary uppercase tracking-wider">
              Today's Menu
            </p>
            <p className="text-3xl font-bold text-aboitiz-textDark group-hover:text-aboitiz-earth transition-colors">
              {todaysMealsCount}
            </p>
            <p className="text-[11px] text-aboitiz-primary/80">
              Meals scheduled today
            </p>
          </div>
          <div className="bg-aboitiz-secondary/15 p-3 rounded-2xl text-aboitiz-primary/80 group-hover:bg-aboitiz-secondary/25 transition-colors flex items-center justify-center">
            <Clock className="w-8 h-8 text-aboitiz-primary" />
          </div>
        </div>
      </div>

      {/* Today's Menu Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-aboitiz-textDark flex items-center gap-2">
            <Utensils className="w-5 h-5 text-aboitiz-primary" />
            Today's Menu Plan
          </h2>
          {todaysMealsCount > 0 && (
            <button
              onClick={() => navigate('/planner')}
              className="text-xs font-semibold text-aboitiz-earth hover:text-aboitiz-earth/80 hover:underline transition-colors"
            >
              Manage in Planner →
            </button>
          )}
        </div>

        {todaysMealsCount === 0 ? (
          /* Empty State */
          <div
            id="dashboard-today-empty-state"
            className="bg-white/60 rounded-2xl border border-aboitiz-primary/10 p-12 text-center"
          >
            <div className="mb-4 flex justify-center">
              <UtensilsCrossed className="w-12 h-12 text-aboitiz-primary/40" />
            </div>
            <p className="text-base font-semibold text-aboitiz-textDark">
              You have no meals scheduled for today
            </p>
            <p className="text-sm text-aboitiz-primary mt-1 mb-6">
              Keep your nutrition on track. Head over to the Planner to schedule your meals.
            </p>
            <button
              id="dashboard-goto-planner-btn"
              onClick={() => navigate('/planner')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-aboitiz-earth text-white
                         text-sm font-semibold hover:bg-aboitiz-earth/90 active:scale-95
                         transition-all duration-150 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Go to Planner
            </button>
          </div>
        ) : (
          /* Menu Cards List */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-todays-meals-grid">
            {todaysMeals.map((s) => {
              const badgeStyle = TIME_SLOT_COLORS[s.timeSlot];
              const prepGuide = s.meal?.preparationGuide || '';
              const guidePreview =
                prepGuide.length > 120 ? `${prepGuide.slice(0, 120)}…` : prepGuide;
              const TimeSlotIcon = TIME_SLOT_ICONS[s.timeSlot];

              return (
                <div
                  key={s.id}
                  id={`dashboard-meal-row-${s.id}`}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-aboitiz-primary/10
                             shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Card Header with Time Slot */}
                  <div className="px-5 py-4 border-b border-aboitiz-primary/5 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                    >
                      <TimeSlotIcon className="w-3.5 h-3.5 flex-shrink-0" /> {s.timeSlot}
                    </span>
                    <span className="text-[10px] text-aboitiz-primary bg-aboitiz-primary/5 px-2 py-0.5 rounded-md font-medium">
                      ID: #{s.id}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-semibold text-aboitiz-textDark line-clamp-2 mb-1.5">
                        {s.meal?.name ?? `Meal #${s.mealId}`}
                      </h3>
                      {guidePreview ? (
                        <p className="text-xs text-aboitiz-textDark/80 leading-relaxed italic line-clamp-3">
                          "{guidePreview}"
                        </p>
                      ) : (
                        <p className="text-xs text-aboitiz-primary/60 italic">
                          No preparation guide provided.
                        </p>
                      )}
                    </div>

                    {/* Ingredients Mini Tags */}
                    {s.meal?.ingredients && s.meal.ingredients.length > 0 ? (
                      <div>
                        <p className="text-[10px] font-semibold text-aboitiz-primary uppercase tracking-wider mb-2">
                          Recipe Ingredients
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {s.meal.ingredients.slice(0, 4).map((ing) => {
                            const name = ing.product?.name ?? ing.customIngredientName ?? 'Ingredient';
                            return (
                              <span
                                key={ing.id}
                                className="inline-flex items-center text-[10px] text-aboitiz-textDark bg-aboitiz-bgLight/40 border border-aboitiz-primary/10 px-2 py-0.5 rounded-md"
                              >
                                {name} ({ing.quantity})
                              </span>
                            );
                          })}
                          {s.meal.ingredients.length > 4 && (
                            <span className="inline-flex items-center text-[9px] font-semibold text-aboitiz-earth bg-aboitiz-sand/20 px-2 py-0.5 rounded-md">
                              +{s.meal.ingredients.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-aboitiz-primary/50 italic">
                        No ingredients added.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
