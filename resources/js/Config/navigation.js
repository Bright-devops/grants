// resources/js/Config/navigation.js
export const adminNav = [
    { label: 'Dashboard', labelKey: 'nav_dashboard', route: 'admin.dashboard', icon: 'LayoutDashboard' },
    { label: 'Users', labelKey: 'nav_users', route: 'admin.users.index', icon: 'Users' },
    { label: 'Grant Plans', labelKey: 'nav_grant_plans', route: 'admin.grant-plans.index', icon: 'FileText' },
    { label: 'Applications', labelKey: 'nav_applications', route: 'admin.applications.index', icon: 'ClipboardList' },
    { label: 'KYC', labelKey: 'nav_kyc', route: 'admin.kyc.index', icon: 'ShieldCheck' },
    { label: 'Wallet', labelKey: 'nav_wallet', route: 'admin.wallet.index', icon: 'Wallet' },
    { label: 'Withdrawals', labelKey: 'nav_withdrawals', route: 'admin.withdrawals.index', icon: 'ArrowDownToLine' },
    { label: 'Payment Methods', labelKey: 'nav_payment_methods', route: 'admin.payment-methods.index', icon: 'CreditCard' },
    { label: 'Payments', labelKey: 'nav_payments', route: 'admin.payments.index', icon: 'Receipt' },
    { label: 'Testimonials', labelKey: 'nav_testimonials', route: 'admin.testimonials.index', icon: 'MessageSquareQuote' },
    { label: 'Pages', labelKey: 'nav_pages', route: 'admin.pages.index', icon: 'Layout' },
    { label: 'Notifications', labelKey: 'nav_notifications', route: 'admin.notifications.index', icon: 'Bell' },
    { label: 'Emails', labelKey: 'nav_emails', route: 'admin.emails.index', icon: 'Mail' },
    { label: 'Activity Logs', labelKey: 'nav_activity_logs', route: 'admin.activity-logs.index', icon: 'History' },
    { label: 'Settings', labelKey: 'nav_settings', route: 'admin.settings.index', icon: 'Settings' },
];

export const userNav = [
    { label: 'Dashboard', labelKey: 'nav_dashboard', route: 'dashboard', icon: 'LayoutDashboard' },
    { label: 'Profile', labelKey: 'nav_profile', route: 'profile.edit', icon: 'User' },
    { label: 'KYC', labelKey: 'nav_kyc', route: 'kyc.index', icon: 'ShieldCheck' },
    { label: 'Grant Plans', labelKey: 'nav_grant_plans', route: 'grant-plans.index', icon: 'FileText' },
    { label: 'Applications', labelKey: 'nav_applications', route: 'applications.index', icon: 'ClipboardList' },
    { label: 'Wallet', labelKey: 'nav_wallet', route: 'wallet.index', icon: 'Wallet' },
    { label: 'Withdrawals', labelKey: 'nav_withdrawals', route: 'withdrawals.index', icon: 'ArrowDownToLine' },
    { label: 'Invoices', labelKey: 'nav_invoices', route: 'invoices.index', icon: 'Receipt' },
    { label: 'Notifications', labelKey: 'nav_notifications', route: 'notifications.index', icon: 'Bell' },
    { label: 'Settings', labelKey: 'nav_settings', route: 'settings.index', icon: 'Settings' },
];
