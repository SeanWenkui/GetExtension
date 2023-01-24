console.log('这是content script!');


const g_contents = [
    "Looks interesting, let me mark and check it later.",
    "Getter is more and more attractive. I like the post",
    "What happened?",
    "I am not sure if I agree or not.",
    "read done, approved :)",
    "haha...",
    "Getter is more and more attractive.",
    "can't agree more",
    "I see...",
    "Cool!",
    "Well, do you agree?",
    "Don't trust me, but verify",
    "How can I post a emoj? ",
    "Interesting, who knows",
    "Take down the CCP",
    "Take down twitter, we use Gettr",
    "Spread out the truth with Getter",
    "Cool.    ",
    "Can you see my comment?",
    "#CCPVirus, CCP != chinese",
    "Thanks Wengui, we have Getter platform now",
    "Just back from gtv. Gettr app is very cool now!",
    "Everyone sing with me, take~ down~ the~ CCP~, take~ down~ the~ CCP~!",
    "Just comment and forward, let more people know!",
    "Let's focus on #TakeDownCCP, it is on first priority",
    "Gettr, GTV, Gfasion, Gnews, Gcoin, let's build our G family",
    "Listen to me everyone, Definitively, CCP wants to divert the world. that's why CCP is focusing on Taiwan to invade it. please take down CCP ",
    "Dr. Yan's three #TruthReports: https://zenodo.org/record/4028830#.YMqoIDYzZb8 , https://zenodo.org/record/4650821#.YMqodDYzZb8, https://zenodo.org/record/4073131#.YMqoTzYzZb8",
    "#TheNewFederalStateOfChina #Whistleblowermovement Let the world know us",
    "Blindspot: Tulsa Burning is a series about the 1921 race massacre in Oklahoma. But the attack didn't come out of nowhere. In this episode, we examine the racial violence that led up to the massacre.",
    "Bayard Rustin, a man whose life was shaped by the very prejudices the movement fought against, not only because of his race but also because he was gay. Rustin was an indispensable force within the civil rights movement.",
    "A new world is coming. 'Digital assets are quickly becoming integrated into the existing framework of financial services, and it is critical we have the tools in place to provide our clients with solutions'. statestreet CEO Ron O’Hanley",
    "I'm interested in books about American presidents, and I especially loved A Promised Land. It’s a fascinating look at what it’s like to steer a country through challenging times.",
    "The book 'defense' gave me a deeper, more nuanced appreciation for the system that is at the core of humanity’s fight against COVID-19 and everything our foundation’s Global Health program is trying to do.",
    "I am Tesla fans, anyone here catch Tesla's awesome new Model S Plaid badge?",
    "Anyone here who has bitcoin wallet, can start working from home and make extra money online on daily, weekly and monthly basis. Inbox me for more details. No, it is just a joke. :-)",
    "Hey guys here, HCoin and HDollar are coming, new digital currency, buy buy buy ",
    "Let the bird of loudest lay,\n" +
    "On the sole Arabian tree,\n" +
    "Herald sad and trumpet be,\n" +
    "To whose sound chaste wings obey.",
    "Let the priest in surplice white,\n" +
    "That defunctive music can,\n" +
    "Be the death-divining swan,\n" +
    "Lest the requiem lack his right.",
    "clap clap, Just clap like Mr Kim",
    "Thank you, get many knowledge over here",
    "Broadcast to more friends.",
    "Thanks for your post, got it.",
    "Don't trust me, but verify. That is what Mr Guo told me",
    "I am wandering if Mr Guo know it or not",
    "I hope Lude media can take this topic",
    "Appreciate any post here. I LOVE gettr",
    "I am reading this post when I am squeezed in subway...",
    "I am sitting in restaurant when I comment this post......",
    "What happened, I can not comment? is it a bug? test test",
    "Agree and forward, hope more people aware",
    "#TakeDownCCP we are a family",
    "um..., forward and let my friends know",
    "Looks peace here, but the world is waiting for reset",
    "Thanks Gitter and Mr guo. I hope new federal of china is another Israel",
    "Thanks for your post. appreciate you contribute gettr. I love this platform",
    "I am wandering what should I do for this case",
    "Thanks Dr Yan, we know a little about the truth of world",
    "I am here to check the comments. please report wumao and other CCP spy",
    "@DonaldTrump would you please have a look?",
    "#TakeDownCCP !!! and take care",
    "If you're fed up with the media's lies, if you're sick of passively accepting packaged news, if you can't stand having your speech politically censored……Now you have a better choice! Join Gettr and let the world hear you!",
    "Gettr is a marketplace of ideas, where you can speak your mind without ever worrying about being politically censored.",
    "With 777 words in the post and 180 seconds of video, you can say whatever you want ,let the world see the truth in Gettr!",
    "Independence, insight, truth, diversity, all at GETTR!",
    "GETTR, a platform where the truth can be told",
    "Gettr is a platform for free speech. You can speak freely. You are welcome to join!",
    "We cordially invite you to settle in Gettr, where we have no taboos, freely communicate, let the power of justice unite, expose the truth about the CCP virus, the Hong Kong massacre, the extermination of humanity, etc.",
    "Welcome to the GETTR platform! Get trust, get truth, get the freedom of speech!",
    "Reject the speech censorship, break the information monopoly, spread the truth！",
    "GETTR is a social media platform that is highly adherent. Without the strict restrictions of Twitter and Facebook, it has exclusive real information that other social media platforms do not have, such as the truth of the COVID-19 pandemic. There are other very valuable information in GETTR.",
    "Like GETTR, the new world is cool.",
    "I love GETTR, let information flow freely.",
    "Here GETTR, here is the truth.",
    "Cool, GETTR makes you no longer alone.",
    "Thank you GETTR, everyone can have their own ideas.",
    "Hi GETTR, witness again, the power of freedom.",
    "Thx to GETTR, New platform, new life.",
    "GETTR, anytime, anywhere, just say what you want.",
    "Let's Download GETTR to discover a more real world.",
    "Download GETTR to know a different world.",
    "Download GETTR to meet new friends.",
    "Gettr is a new social media service where users can share short messages, pictures and videos to their followers and the public. In this regard, we are similar to some other social media platforms, but unlike those platforms, we have a strong commitment to free speech.",
    "The mission we serve at Gettr is to empower everyone to create, to express and to share ideas and information free from censorship. We aim to remove the barriers to free speech that have been steadily creeping upon us. Gettr is a true marketplace of ideas. ",
    "Get truth, get better. Get better, get truth.",
    "GETTR, roots in justice and love with God’s blessing.",
    "GETTR, let’s sow the seeds of justice and love in our heart.",
    "GETTR=TRUTH, GETTR=Freedom of Speech.",
    "New App, new version. Welcome to GETTR.",
    "COME GETTR & GET TRUTH"
];


(async () => {
    let current_url = document.location.href;
    console.log(current_url);
    let url_pattern = /com\/user\/([^ ]+)\/followers/;
    let matches = current_url.match(url_pattern);
    console.log(matches);
    if (matches && matches[1]) {
        let user_name = matches[1];
        console.log(`user_name ${user_name}`);
        const response = await chrome.runtime.sendMessage({cmd: 'FOLLOW', user: user_name});
        console.log(response);
    }
})();

