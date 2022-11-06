import { createContext, Fragment, useState, useEffect } from 'react'

const UserContext = createContext(undefined)

const UserContextProvider = ({ children }) => {
    const chainsawMan = {
        backdrop_path: '/5DUMPBSnHOZsbBv81GFXZXvDpo6.jpg',
        first_air_date: '2022-10-12',
        genre_ids: [16, 10759, 10765, 35],
        id: 114410,
        media_type: 'tv',
        name: 'Chainsaw Man',
        origin_country: ['JP'],
        original_language: 'ja',
        original_name: 'チェンソーマン',
        overview:
            'Denji has a simple dream—to live a happy and peaceful life, spending time with a girl he likes. This is a far cry from reality, however, as Denji is forced by the yakuza into killing devils in order to pay off his crushing debts. Using his pet devil Pochita as a weapon, he is ready to do anything for a bit of cash.',
        popularity: 1361.153,
        poster_path: '/npdB6eFzizki0WaZ1OvKcJrWe97.jpg',
        vote_average: 8.7,
        vote_count: 161,
    }

    const fakeMediaSearch = [
        {
            id:99,
            tmdbID:999,
            type:'movie',
            title: 'Everything Everywhere All at Once',
            image: 'https://www.themoviedb.org/t/p/original/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
            synopsis:
                "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led in other universes.",
            rating: 81,
        },
        {
            id:19,
            tmdbID:199,
            type:'movie',
            title: "Don't Worry Darling",
            image: 'https://www.themoviedb.org/t/p/original/jOqxKIOC92BVyinYO1Fm73XY7Tc.jpg',
            synopsis:
                'Alice and Jack are lucky to be living in the idealized community of Victory, the experimental company town housing the men who work for the top-secret Victory Project and their families. But when cracks in their idyllic life begin to appear, exposing flashes of something much more sinister lurking beneath the attractive façade, Alice can’t help questioning exactly what they’re doing in Victory, and why.',
            rating: 69, //nice
        },
        {
            id:29,
            tmdbID:299,
            type:'movie',
            title: 'Stranger Things',
            image: 'https://www.themoviedb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
            synopsis:
                ' When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
            rating: 86,
        },
        {
            title: 'Doctor Who',
            poster: 'https://www.themoviedb.org/t/p/original/sz4zF5z9zyFh8Z6g5IQPNq91cI7.jpg',
            synopsis:
                "The Doctor is a Time Lord: a 900 year old alien with 2 hearts, part of a gifted civilization who mastered time travel. The Doctor saves planets for a living—more of a hobby actually, and the Doctor's very, very good at it.",
            score: 74,
        },
        {
            title: "Bob's Burgers",
            poster: 'https://www.themoviedb.org/t/p/original/4Mey4NYqXH0LlDO06ebevkDleTo.jpg',
            synopsis: `Bob's Burgers follows a third-generation restaurateur, Bob, as he runs Bob's Burgers with the help of his wife and their three kids. Bob and his quirky family have big ideas about burgers, but fall short on service and sophistication. Despite the greasy counters, lousy location and a dearth of customers, Bob and his family are determined to make Bob's Burgers "grand re-re-re-opening" a success.`,
            score: 79,
        },
        {
            title: 'Barbarian',
            poster: 'https://www.themoviedb.org/t/p/original/idT5mnqPcJgSkvpDX7pJffBzdVH.jpg',
            synopsis: `In town for a job interview, a young woman arrives at her Airbnb late at night only to find that it has been mistakenly double-booked and a strange man is already staying there. Against her better judgement, she decides to stay the night anyway, but soon discovers that there is much more to be afraid of in the house than the other guest.`,
            score: 72,
        },
        {
            title: 'Pearl',
            poster: 'https://www.themoviedb.org/t/p/original/ulBLIBqvdnf4H6JBt0OpMCU1ECn.jpg',
            synopsis: `Trapped on her family’s isolated farm, Pearl must tend to her ailing father under the bitter and overbearing watch of her devout mother. Lusting for a glamorous life like she’s seen in the movies, Pearl’s ambitions, temptations and repressions collide.`,
            score: 70,
        },
        {
            title: 'The Deep House',
            poster: 'https://www.themoviedb.org/t/p/original/5xhAPxRr64oQPEFnUOrttuI4ZEU.jpg',
            synopsis: `While diving in a remote French lake, a couple of YouTubers who specialize in underwater exploration videos discover a house submerged in the deep waters. What was initially a unique finding soon turns into a nightmare when they discover that the house was the scene of atrocious crimes. Trapped, with their oxygen reserves falling dangerously, they realize the worst is yet to come: they are not alone in the house.`,
            score: 62,
        },
    ]

    const [fakeDBInfo, setFakeDBInfo] = useState({
        id: 101,
        username: 'Tree',
        profileID: 0,
        bio: 'Very cool guy, please be nice or I WILL cry',
        accessToken: false,
        dateJoined: '2022-10-27 17:54:04',
        groups: [
            {
                groupName: 'My Lists',
                groupID: 0,
                members: [{ username: 'tree', profileID: 0 }],
                lists: [
                    {
                        listName: 'Just Adam Sandler >:)',
                        listID: 123,
                        listMembers: [{ username: 'tree', profileID: 0 }],
                        media: [
                            {
                                title: '50 First Dates',
                                poster: 'https://www.themoviedb.org/t/p/original/5NxTW4SS6aUKZYnbQzh7UYNivd.jpg',
                                synopsis:
                                    "Henry is a player skilled at seducing women. But when this veterinarian meets Lucy, a girl with a quirky problem when it comes to total recall, he realizes it's possible to fall in love all over again…and again, and again. That's because the delightful Lucy has no short-term memory, so Henry must woo her day after day until he finally sweeps her off her feet.",
                                score: 68,
                                addedBy: 'tree',
                            },
                            {
                                title: 'Click',
                                poster: 'https://www.themoviedb.org/t/p/original/oL0k5JA53PyoHSZqKb3cNkhwBCE.jpg',
                                synopsis:
                                    "A married workaholic, Michael Newman doesn't have time for his wife and children, not if he's to impress his ungrateful boss and earn a well-deserved promotion. So when he meets Morty, a loopy sales clerk, he gets the answer to his prayers: a magical remote that allows him to bypass life's little distractions with increasingly hysterical results.",
                                score: 62,
                                addedBy: 'tree',
                            },
                            {
                                title: 'Hotel Transylvania',
                                poster: 'https://www.themoviedb.org/t/p/original/eJGvzGrsfe2sqTUPv5IwLWXjVuR.jpg',
                                synopsis:
                                    "Welcome to Hotel Transylvania, Dracula's lavish five-stake resort, where monsters and their families can live it up and no humans are allowed. One special weekend, Dracula has invited all his best friends to celebrate his beloved daughter Mavis's 118th birthday. For Dracula catering to all of these legendary monsters is no problem but the party really starts when one ordinary guy stumbles into the hotel and changes everything!",
                                score: 70,
                                addedBy: 'tree',
                            },
                        ],
                    },
                ],
            },
            {
                groupName: 'Bad Movie Club',
                groupID: 101,
                members: [
                    { username: 'tree', profileID: 0 },
                    { username: 'definetlyDaniel', profileID: 1 },
                    { username: 'milliam', profileID: null },
                ],
                lists: [
                    {
                        listName: 'Bad Horror',
                        listID: 101,
                        listMembers: [
                            { username: 'tree', profileID: 0 },
                            { username: 'definetlyDaniel', profileID: 1 },
                            { username: 'milliam', profileID: null },
                        ],
                        media: [
                            {
                                title: 'Old',
                                poster: 'https://www.themoviedb.org/t/p/original/vclShucpUmPhdAOmKgf3B3Z4POD.jpg',
                                synopsis:
                                    'A group of families on a tropical holiday discover that the secluded beach where they are staying is somehow causing them to age rapidly – reducing their entire lives into a single day.',
                                score: 65,
                                addedBy: 'tree',
                            },
                            {
                                title: 'Slender Man',
                                poster: 'https://www.themoviedb.org/t/p/original/huSncs4RyvQDBmHjBBYHSBYJbSJ.jpg',
                                synopsis:
                                    'In a small town in Massachusetts, four high school girls perform a ritual in an attempt to debunk the lore of Slender Man. When one of the girls goes mysteriously missing, they begin to suspect that she is, in fact, his latest victim.',
                                score: 44,
                                addedBy: 'milliam',
                            },
                            {
                                title: 'The Wicker Man',
                                poster: 'https://www.themoviedb.org/t/p/original/9G6TBckQUKdx3dnn55abUCmonRX.jpg',
                                synopsis: `A sheriff investigating the disappearance of a young girl from a small island discovers there's a larger mystery to solve among the island's secretive, neo-pagan community.`,
                                score: 43,
                                addedBy: 'tree',
                            },
                        ],
                    },
                    {
                        listName: 'Bad Anime',
                        listID: 299,
                        listMembers: [
                            { username: 'tree', profileID: 0 },
                            { username: 'definetlyDaniel', profileID: 1 },
                        ],
                        media: [
                            {
                                title: 'Sword Art Online',
                                poster: 'https://www.themoviedb.org/t/p/original/mK9zGGk90VmHLOnK79sqlGFjZjW.jpg',
                                synopsis:
                                    "In the near future, a Virtual Reality Massive Multiplayer Online Role-Playing Game (VRMMORPG) called Sword Art Online has been released where players control their avatars with their bodies using a piece of technology called Nerve Gear. One day, players discover they cannot log out, as the game creator is holding them captive unless they reach the 100th floor of the game's tower and defeat the final boss. However, if they die in the game, they die in real life. Their struggle for survival starts now...",
                                score: 83,
                                addedBy: 'definetlyDaniel',
                            },
                            {
                                title: 'Berserk (2016)',
                                poster: 'https://www.themoviedb.org/t/p/original/xAdubqXNpbmVJyZQNaQ1E4dIfe9.jpg',
                                synopsis:
                                    'Spurred by the flame raging in his heart, the Black Swordsman Guts continues his seemingly endless quest for revenge. Standing in his path are heinous outlaws, delusional evil spirits, and a devout child of god. Even as it chips away at his life, Guts continues to fight his enemies, who wield repulsive and inhumane power, with nary but his body and sword—his strength as a human.',
                                score: 76,
                                addedBy: 'tree',
                            },
                        ],
                    },
                ],
            },
            {
                groupName: 'Bees!?!?!?!',
                groupID: 111,
                members: [
                    { username: 'tree', profileID: 0 },
                    { username: 'definetlyDaniel', profileID: 1 },
                ],
                lists: [
                    {
                        listName: 'Just the Bee Movie',
                        listID: 110,
                        listMembers: [
                            { username: 'definetlyDaniel', profileID: 1 },
                        ],
                        media: [
                            {
                                title: 'Bee Movie',
                                poster: 'https://www.themoviedb.org/t/p/original/aWe27GmvfVYAd7p0KEtJZWwLWk5.jpg',
                                synopsis:
                                    "Barry B. Benson, a bee who has just graduated from college, is disillusioned at his lone career choice: making honey. On a special trip outside the hive, Barry's life is saved by Vanessa, a florist in New York City. As their relationship blossoms, he discovers humans actually eat honey, and subsequently decides to sue us.",
                                score: 60,
                                addedBy: 'definetlyDaniel',
                            },
                        ],
                    },
                ],
            },
        ],
    })

    const [userInfo, setUserInfo] = useState(false)
    const [autoFillMedia, setAutoFillMedia] = useState(false);

    return (
        <Fragment>
            <UserContext.Provider
                value={{
                    fakeDBInfo,
                    setFakeDBInfo,
                    fakeMediaSearch,
                    chainsawMan,
                    userInfo,
                    setUserInfo,
                    autoFillMedia,
                    setAutoFillMedia
                }}
            >
                {children}
            </UserContext.Provider>
        </Fragment>
    )
}

export { UserContextProvider, UserContext }
