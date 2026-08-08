import UserLayout from '@/Layouts/UserLayout';
import VoucherCard from '@/Components/VoucherCard';
import { Download } from 'lucide-react';

export default function InvoicesIndex({ invoices }) {
    return (
        <UserLayout header="Invoices">
            {invoices.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                    <p className="text-navy/50 text-sm">No invoices yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {invoices.map((invoice) => (
                        <VoucherCard key={invoice.id}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-mono text-sm text-navy">{invoice.invoice_number}</p>
                                    <p className="text-xs text-navy/40 mt-0.5">
                                        Withdrawal: {invoice.withdrawal.reference} · ${invoice.withdrawal.amount}
                                    </p>
                                </div>
                                
                                   <a href={invoice.download_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-signal text-navy font-semibold text-xs px-3 py-2 rounded-lg hover:bg-signal-dark transition-colors">
                                    <Download size={14} /> Download
                                </a>
                            </div>
                        </VoucherCard>
                    ))}
                </div>
            )}
        </UserLayout>
    );
}