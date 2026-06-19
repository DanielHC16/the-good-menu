import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Sends an HTML-formatted audit-alert email to the Team Lead address
   * configured in the TL_EMAIL environment variable.
   */
  async sendAuditAlert(
    action: string,
    tableName: string,
    recordId: number,
    changes: any,
  ): Promise<void> {
    const recipient = this.configService.get<string>('TL_EMAIL');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #e74c3c;">🔔 Database Audit Alert</h2>
        <hr style="border: 1px solid #eee;" />
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Action</td>
            <td style="padding: 8px;">${action}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">Table</td>
            <td style="padding: 8px;">${tableName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Record ID</td>
            <td style="padding: 8px;">${recordId}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">Changes</td>
            <td style="padding: 8px;">
              <pre style="background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 13px;">${JSON.stringify(changes, null, 2)}</pre>
            </td>
          </tr>
        </table>
        <p style="margin-top: 16px; font-size: 12px; color: #999;">
          Sent automatically by The Good Menu Audit System at ${new Date().toISOString()}
        </p>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: recipient,
        subject: `Audit Alert: ${action} on ${tableName} (#${recordId})`,
        html: htmlBody,
      });
      this.logger.log(
        `Audit email sent → ${action} on ${tableName} #${recordId}`,
      );
    } catch (error) {
      this.logger.error('Failed to send audit email', error);
    }
  }
}
