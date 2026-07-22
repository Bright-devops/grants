import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                    Get Started
                </span>

                <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
                    Create Your Account
                </h1>

                <p className="mt-4 text-lg leading-8 text-slate-600">
                    Join United Care Alliance to start your application and
                    access community assistance services.
                </p>

            </div>

            <form
                onSubmit={submit}
                className="mt-10 space-y-7"
            >

                {/* NAME */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Full Name
                    </label>

                    <div className="relative">

                        <User
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={data.name}
                            autoComplete="name"
                            autoFocus
                            onChange={(e) =>
                                setData("name", e.target.value)
                            }
                            placeholder="Enter your full name"
                            className={`h-14 w-full rounded-2xl border pl-12 pr-4 transition outline-none focus:ring-4 focus:ring-blue-100 ${
                                errors.name
                                    ? "border-red-400"
                                    : "border-slate-300 focus:border-blue-600"
                            }`}
                        />

                    </div>

                    {errors.name && (

                        <p className="mt-2 text-sm text-red-600">
                            {errors.name}
                        </p>

                    )}

                </div>

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
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Create a password"
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

                {/* CONFIRM PASSWORD */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Confirm Password
                    </label>

                    <div className="relative">

                        <Lock
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData(
                                    "password_confirmation",
                                    e.target.value
                                )
                            }
                            placeholder="Re-enter your password"
                            className={`h-14 w-full rounded-2xl border pl-12 pr-14 transition outline-none focus:ring-4 focus:ring-blue-100 ${
                                errors.password_confirmation
                                    ? "border-red-400"
                                    : "border-slate-300 focus:border-blue-600"
                            }`}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>

                    </div>

                    {errors.password_confirmation && (

                        <p className="mt-2 text-sm text-red-600">
                            {errors.password_confirmation}
                        </p>

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
                            Creating Account...
                        </>

                    ) : (

                        <>
                            <UserPlus size={20} />
                            Create Account
                        </>

                    )}

                </button>

                {/* LOGIN LINK */}

                <p className="text-center text-sm text-slate-600">

                    Already have an account?{" "}

                    <Link
                        href={route("login")}
                        className="font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                        Sign in
                    </Link>

                </p>

            </form>

        </GuestLayout>
    );
}