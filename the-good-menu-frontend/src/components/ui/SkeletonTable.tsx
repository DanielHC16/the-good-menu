interface SkeletonTableProps {
  rowCount?: number;
}

export default function SkeletonTable({ rowCount = 5 }: SkeletonTableProps) {
  // Generate rows
  const rows = Array.from({ length: rowCount });

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-aboitiz-primary/10 shadow-sm overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          {/* Skeleton Header */}
          <thead>
            <tr className="border-b border-aboitiz-primary/10 bg-aboitiz-bgLight/60">
              <th className="px-5 py-4 w-1/4">
                <div className="h-3.5 bg-aboitiz-secondary/30 rounded w-20" />
              </th>
              <th className="px-5 py-4 w-1/4">
                <div className="h-3.5 bg-aboitiz-secondary/30 rounded w-24" />
              </th>
              <th className="px-5 py-4 w-1/4">
                <div className="h-3.5 bg-aboitiz-secondary/30 rounded w-16" />
              </th>
              <th className="px-5 py-4 w-1/4 text-right">
                <div className="h-3.5 bg-aboitiz-secondary/30 rounded w-20 ml-auto" />
              </th>
            </tr>
          </thead>

          {/* Skeleton Body */}
          <tbody className="divide-y divide-aboitiz-primary/5">
            {rows.map((_, index) => {
              // Vary widths slightly per row to mimic organic database records
              const width1 = index % 3 === 0 ? 'w-3/4' : index % 3 === 1 ? 'w-2/3' : 'w-1/2';
              const width2 = index % 2 === 0 ? 'w-1/2' : 'w-2/3';
              const width3 = index % 3 === 0 ? 'w-2/3' : index % 3 === 1 ? 'w-1/2' : 'w-3/4';
              const width4 = index % 2 === 0 ? 'w-16' : 'w-24';

              return (
                <tr key={index} className="hover:bg-aboitiz-secondary/5 transition-colors duration-150">
                  <td className="px-5 py-4">
                    <div className={`h-4 bg-aboitiz-secondary/20 rounded ${width1}`} />
                  </td>
                  <td className="px-5 py-4">
                    <div className={`h-4 bg-aboitiz-secondary/20 rounded ${width2}`} />
                  </td>
                  <td className="px-5 py-4">
                    <div className={`h-4 bg-aboitiz-secondary/20 rounded ${width3}`} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className={`h-4 bg-aboitiz-secondary/20 rounded ${width4} ml-auto`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Skeleton Footer */}
      <div className="px-5 py-3 border-t border-aboitiz-primary/10 bg-aboitiz-bgLight/40">
        <div className="h-3 bg-aboitiz-secondary/20 rounded w-40" />
      </div>
    </div>
  );
}
