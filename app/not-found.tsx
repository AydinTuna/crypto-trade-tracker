import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Page Not Found</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="btn-primary inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
} 