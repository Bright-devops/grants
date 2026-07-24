import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    LogIn,
    Loader2,
    ShieldCheck,
    CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
};

function FormField({ label, icon: Icon, error, children, trailing }) {
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
                {trailing}
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

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
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
            <Head title="Sign In" />

            <motion.div initial="hidden" animate="visible">

                {/* ---- Header ---- */}
                <motion.div variants={fadeUp} custom={0}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 ring-1 ring-inset ring-primary-100">
                        <ShieldCheck size={15} />
                        Secure Access
                    </span>

                    <h1 className="mt-6 text-[2.25rem] font-bold leading-[1.15] tracking-tight text-ink">
                        Welcome back
                    </h1>

                    <p className="mt-3 text-[15px] leading-7 text-slate-500">
                        Sign in to continue your application, manage your profile,
                        and securely access United Care Alliance services.
                    </p>
                </motion.div>

                {/* ---- Status message ---- */}
                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-7 flex items-start gap-3 rounded-2xl border border-success-100 bg-success-50 p-4"
                    >
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success-600" />
                        <p className="text-sm font-medium text-success-700">{status}</p>
                    </motion.div>
                )}

                {/* ---- Form ---- */}
                <form onSubmit={submit} className="mt-9 space-y-6">

                    <motion.div variants={fadeUp} custom={1}>
                        <FormField label="Email address" icon={Mail} error={errors.email}>
                            <input
                                type="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="Enter your email address"
                                className={`${inputBase} ${inputState(errors.email)}`}
                            />
                        </FormField>
                    </motion.div>

                    <motion.div variants={fadeUp} custom={2}>
                        <FormField
                            label="Password"
                            icon={Lock}
                            error={errors.password}
                            trailing={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-ink"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                </button>
                            }
                        >
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="Enter your password"
                                className={`${inputBase} pr-14 ${inputState(errors.password)}`}
                            />
                        </FormField>
                    </motion.div>

                    {/* ---- Remember me + Forgot password ---- */}
                    <motion.div
                        variants={fadeUp}
                        custom={3}
                        className="flex items-center justify-between"
                    >
                        <label className="flex cursor-pointer items-center gap-2.5 select-none">
                            <span className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-colors checked:border-primary-600 checked:bg-primary-600"
                                />
                                <svg
                                    className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                >
                                    <path
                                        d="M2 6l2.5 2.5L10 3"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            <span className="text-sm font-medium text-slate-600">
                                Remember me
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </motion.div>

                    {/* ---- Submit ---- */}
                    <motion.div variants={fadeUp} custom={4}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary-600 text-[15px] font-semibold text-white shadow-lg shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? (
                                <>
                                    <Loader2 size={19} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn
                                        size={19}
                                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                                    />
                                    Sign in
                                </>
                            )}
                        </button>

                        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                            <ShieldCheck size={13} />
                            Protected by encrypted, secure authentication
                        </p>
                    </motion.div>

                    {/* ---- Register link ---- */}
                    <motion.p
                        variants={fadeUp}
                        custom={5}
                        className="border-t border-slate-100 pt-6 text-center text-sm text-slate-500"
                    >
                        Don't have an account?{" "}
                        <Link
                            href={route("register")}
                            className="font-semibold text-primary-600 transition-colors hover:text-primary-700"
                        >
                            Create one
                        </Link>
                    </motion.p>

                </form>

            </motion.div>
        </GuestLayout>
    );
}