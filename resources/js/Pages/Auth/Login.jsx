import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { useState } from "react";

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

    return (
        <GuestLayout>
            <Head title="Sign In" />

            <div>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                    Secure Access
                </span>

                <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
                    Welcome Back
                </h1>

                <p className="mt-4 text-lg leading-8 text-slate-600">
                    Sign in to continue your application, manage your profile,
                    and securely access United Care Alliance services.
                </p>

            </div>

            {status && (

                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {status}
                </div>

            )}

            <form
                onSubmit={submit}
                className="mt-10 space-y-7"
            >

                {/* EMAIL */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Email Address
                    </label>

                    <div className="relative">

                        <Mail
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="email"
                            value={data.email}
                            autoComplete="username"
                            onChange={(e) =>
                                setData("email", e.target.value)
                            }
                            placeholder="Enter your email address"
                            className={`h-14 w-full rounded-2xl border pl-12 pr-4 transition outline-none focus:ring-4 focus:ring-blue-100 ${
                                errors.email
                                    ? "border-red-400"
                                    : "border-slate-300 focus:border-blue-600"
                            }`}
                        />

                    </div>

                    {errors.email && (

                        <p className="mt-2 text-sm text-red-600">
                            {errors.email}
                        </p>

                    )}

                </div>

                {/* PASSWORD */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Password
                    </label>

                    <div className="relative">

                        <Lock
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Enter your password"
                            className={`h-14 w-full rounded-2xl border pl-12 pr-14 transition outline-none focus:ring-4 focus:ring-blue-100 ${
                                errors.password
                                    ? "border-red-400"
                                    : "border-slate-300 focus:border-blue-600"
                            }`}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>

                    </div>

                    {errors.password && (

                        <p className="mt-2 text-sm text-red-600">
                            {errors.password}
                        </p>

                    )}

                </div>

                {/* REMEMBER ME + FORGOT PASSWORD */}

                <div className="flex items-center justify-between">

                    <label className="flex cursor-pointer items-center gap-3">

                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-4 focus:ring-blue-100"
                        />

                        <span className="text-sm font-medium text-slate-600">
                            Remember me
                        </span>

                    </label>

                    {canResetPassword && (

                        <Link
                            href={route("password.request")}
                            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                        >
                            Forgot password?
                        </Link>

                    )}

                </div>

                {/* SUBMIT */}

                <button
                    type="submit"
                    disabled={processing}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >

                    {processing ? (

                        <>
                            <Loader2
                                size={20}
                                className="animate-spin"
                            />
                            Signing In...
                        </>

                    ) : (

                        <>
                            <LogIn size={20} />
                            Sign In
                        </>

                    )}

                </button>

                {/* REGISTER LINK */}

                <p className="text-center text-sm text-slate-600">

                    Don't have an account?{" "}

                    <Link
                        href={route("register")}
                        className="font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                        Create one
                    </Link>

                </p>

            </form>

        </GuestLayout>
    );
}