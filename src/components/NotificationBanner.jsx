import React from 'react';

const NotificationBanner = () => {
    return (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-4 text-center shadow-lg border-b border-purple-500">
            <p className="font-medium text-sm md:text-base">
                <span className="font-bold text-yellow-400 mr-2">Using Free Hosting Plan:</span>
                We do not have enough resources to continue hosting the media. For that reason, you can't listen to old or previously created content, but you can generate your own, download, and enjoy it.
            </p>
        </div>
    );
};

export default NotificationBanner;
