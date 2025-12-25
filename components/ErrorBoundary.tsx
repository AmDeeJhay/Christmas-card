"use client";
import React from "react";
import Toast from "./Toast";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: any) {
        // Log to console / remote logger if desired
        console.error("Uncaught error in component tree:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-[#110000] text-white">
                    <div className="max-w-lg text-center">
                        <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
                        <p className="mb-4 text-sm text-slate-300">An unexpected error occurred. Try refreshing the page or contact support.</p>
                        <div className="flex gap-2 justify-center">
                            <button onClick={() => location.reload()} className="px-4 py-2 rounded bg-white text-black">Reload</button>
                        </div>
                    </div>
                    <Toast message={this.state.error?.message || 'An error occurred'} type="error" />
                </div>
            );
        }

        return this.props.children;
    }
}
