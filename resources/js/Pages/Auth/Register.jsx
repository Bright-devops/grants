import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    UserPlus,
    Loader2,
    ShieldCheck,
    Check,
} from "lucide-react";
import { useState, useMemo } from "react";

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
};

// ---- Password strength helper ----
function getStrength(password) {
    if (!password) return { score: 0, label: "", color: "bg-slate-200" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        { label: "Too weak", color: "bg-danger-500" },
        { label: "Weak", color: "bg-danger-500" },
        { label: "Fair", color: "bg-warning-500" },
        { label: "Good", color: "bg-primary-500" },
        { label: "Strong", color: "bg-success-500" },
    ];

    return { score, ...levels[score] };
}

function FormField({
    label,
    icon: Icon,
    error,
    children,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-ink">
                {label}
            </label>

            <div className="relative">
                <Icon
                    size={19}
                    strokeWidth={2}
                    className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                        error ? "text-danger-400" : "text-slate-400"
                    }`}
                />
                {children}
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 flex items-center gap-1.5 text-sm text-danger-600"
                >
                    <span className="h-1 w-1 rounded-full bg-danger-500" />
                    {error}
                </motion.p>
            )}
        </div>
    );
}

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const strength = useMemo(() => getStrength(data.password), [data.password]);
    const passwordsMatch =
        data.password_confirmation.length > 0 &&
        data.password === data.password_confirmation;

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const inputBase =
        "h-14 w-full rounded-2xl border bg-white pl-12 pr-4 text-[15px] text-ink placeholder:text-slate-400 transition-all duration-200 outline-none focus:ring-[3px]";

    const inputState = (hasError) =>
        hasError
            ? "border-danger-300 focus:border-danger-400 focus:ring-danger-100"
            : "border-slate-200 focus:border-primary-500 focus:ring-primary-100";

    return (
        <GuestLayout>
            <Head title="Register" />

            <motion.div initial="hidden" animate="visible">

                {/* ---- Header ---- */}
                <motion.div variants={fadeUp} custom={0}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 ring-1 ring-inset ring-primary-100">
                        <ShieldCheck size={15} />
                        Get Started
                    </span>

                    <h1 className="mt-6 text-[2.25rem] font-bold leading-[1.15] tracking-tight text-ink">
                        Create your account
                    </h1>

                    <p className="mt-3 text-[15px] leading-7 text-slate-500">
                        Join United Care Alliance to start your application and
                        access community assistance services.
                    </p>
                </motion.div>

                {/* ---- Form ---- */}
                <form onSubmit={submit} className="mt-9 space-y-6">

                    <motion.div variants={fadeUp} custom={1}>
                        <FormField label="Full name" icon={User} error={errors.name}>
                            <input
                                type="text"
                                value={data.name}
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Enter your full name"
                                className={`${inputBase} ${inputState(errors.name)}`}
                            />
                        </FormField>
                    </motion.div>

                    <motion.div variants={fadeUp} custom={2}>
                        <FormField label="Email address" icon={Mail} error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="Enter your email address"
                                className={`${inputBase} ${inputState(errors.email)}`}
                            />
                        </FormField>
                    </motion.div>

                    <motion.div variants={fadeUp} custom={3}>
                        <FormField label="Password" icon={Lock} error={errors.password}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="Create a password"
                                className={`${inputBase} pr-14 ${inputState(errors.password)}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-ink"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </FormField>

                        {/* Strength meter */}
                        {data.password.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 overflow-hidden"
                            >
                                <div className="flex gap-1.5">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                                                i < strength.score ? strength.color : "bg-slate-150 bg-slate-200"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="mt-1.5 text-xs font-medium text-slate-500">
                                    {strength.label}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div variants={fadeUp} custom={4}>
                        <FormField
                            label="Confirm password"
                            icon={Lock}
                            error={errors.password_confirmation}
                        >
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password_confirmation", e.target.value)
                                }
                                placeholder="Re-enter your password"
                                className={`${inputBase} pr-14 ${inputState(
                                    errors.password_confirmation
                                )}`}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-ink"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                            </button>
                        </FormField>

                        {passwordsMatch && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success-600"
                            >
                                <Check size={14} strokeWidth={3} />
                                Passwords match
                            </motion.p>
                        )}
                    </motion.div>

                    {/* ---- Submit ---- */}
                    <motion.div variants={fadeUp} custom={5}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary-600 text-[15px] font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={19} className="animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus
                                        size={19}
                                        className="transition-transform duration-200 group-hover:-translate-y-0.5"
                                    />
                                    Create account
                                </>
                            )}
                        </button>

                        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                            <ShieldCheck size={13} />
                            Your information is encrypted and handled securely
                        </p>
                    </motion.div>

                    {/* ---- Login link ---- */}
                    <motion.p
                        variants={fadeUp}
                        custom={6}
                        className="border-t border-slate-100 pt-6 text-center text-sm text-slate-500"
                    >
                        Already have an account?{" "}
                        <Link
                            href={route("login")}
                            className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
                        >
                            Sign in
                        </Link>
                    </motion.p>

                </form>

            </motion.div>
        </GuestLayout>
    );
}