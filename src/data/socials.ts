export const socials = [
    {
        link: 'https://t.me/ilmtest',
        thumbnail: '/telegram.png',
        title: 'Telegram',
    },
    {
        link: 'https://instagram.com/ilmtest',
        thumbnail: '/instagram.png',
        title: 'Instagram',
    },
    {
        link: 'https://ilmtest.tumblr.com',
        thumbnail: '/tumblr.png',
        title: 'Tumblr',
    },
    {
        link: 'https://fb.me/ilmtest',
        thumbnail: '/facebook.png',
        title: 'Meta',
    },
    {
        link: 'https://x.com/ilmtest_',
        thumbnail: '/twitter.png',
        title: 'X',
    },
    {
        link: 'https://youtube.com/@ilmtest',
        thumbnail: '/youtube.png',
        title: 'YouTube',
    },
    {
        link: 'https://t.me/ilmtest_project',
        thumbnail: '/telegram_project.png',
        title: 'IlmTest Project Group',
    },
    {
        link: 'https://t.me/ilmtest_research',
        thumbnail: '/telegram_research.png',
        title: 'IlmTest Research Channel',
    },
];

const FIRST_TELEGRAM_POST = new Date(2017, 9, 17).getTime();

export const getDaysActive = (): number => {
    const differenceInMilliseconds = new Date().getTime() - FIRST_TELEGRAM_POST;
    return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
};
