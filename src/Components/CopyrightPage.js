import React, { useState } from 'react';

const style = {
    container: {
        maxWidth: '100%',
        margin: '0',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'white',
        borderTop: '1px solid black',
        paddingBottom: '150px'
    },
    tabs: {
        color: 'blue',
        display: 'flex',
        justifyContent: 'left',
        marginBottom: '2px',
        marginTop: '30px',
        paddingBottom: '10px',
        paddingLeft: '30px',
    },

    tab: {
        marginRight: '15px',
        cursor: 'pointer',
        fontWeight: '400',
        borderBottom: '2px solid #ccc',
        paddingBottom: '5px',
    },
    activeTab: {
        borderBottom: '2px solid #000',
    },
    content: {
        display: "flex",
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '16px',
        marginBottom: '10px',
        marginTop: '100px',
    },
    list: {
        width: '60%',
        fontSize: '16px',
        marginBottom: '10px',
        paddingLeft: '20px',
    },
    copyright: {
        fontSize: '14px',
        marginTop: '20px',
        fontStyle: 'italic',
    },
};

const sections = [
    { id: 'about', title: 'About' },
    { id: 'mission', title: 'Our Mission' },
    { id: 'skills', title: 'Our Skills' },
    { id: 'copyright', title: 'Copyright Notice' },
];

const ContentSection = ({ id, title, content }) => {
    return (
        <div id={id} style={style.content}>
            <h2>{title}</h2>
            {content}
        </div>
    );
};

const CopyrightPage = () => {
    const [activeTab, setActiveTab] = useState(sections[0].id);

    const handleTabClick = (id) => {
        setActiveTab(id);
    };

    return (
        <div style={style.container}>
            <section id={'aboutussection'}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-end',
                        width: '50%',
                        height: '90%',
                        color: 'white',
                        fontWeight: 'bolder',
                        padding: '40px',
                    }}
                >
                    <p style={{fontSize: '30px', fontFamily: 'Times'}}>ListingBuddy <br/> <span style={{fontSize: '20px',}}>Where your wish of owning a house becomes a joyful reality.</span></p>

                </div>

            </section>
            <div style={style.tabs}>
                {sections.map((section) => (
                    <div
                        key={section.id}
                        style={{
                            ...style.tab,
                            ...(activeTab === section.id ? style.activeTab : {}),
                        }}
                        onClick={() => handleTabClick(section.id)}
                    >
                        {section.title}
                    </div>
                ))}
            </div>

            {activeTab === 'about' && (
                <ContentSection
                    id="about"
                    title="About"
                    content={
                        <p style={{width: '60%'}}>
                            ListingBuddy is a premier real estate listing website dedicated to providing exceptional services in the world of real estate. Our mission is to revolutionize the way properties are listed and discovered, empowering individuals to showcase their talents and find their dream homes.
                            <br/><br/> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>

                    }
                />
            )}

            {activeTab === 'mission' && (
                <ContentSection
                    id="mission"
                    title="Our Mission"
                    content={
                        <p style={{width: '60%'}}>
                            At ListingBuddy, our mission is to empower real estate professionals and individuals alike by offering a cutting-edge platform to list and discover properties. We strive to create a seamless experience for buyers and sellers, fostering connections and facilitating successful transactions.
                            <br/><br/> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    }
                />
            )}

            {activeTab === 'skills' && (
                <ContentSection
                    id="skills"
                    title="Our Skills"
                    content={
                        <ul style={style.list}>
                            <li>Advanced Property Listing Management: Our platform provides robust tools and features to effectively manage and showcase your property listings. From comprehensive property details to high-quality images, we ensure your listings stand out and attract potential buyers.</li><br/>
                            <li>Intelligent Search and Filtering: Our intelligent search algorithm enables users to easily find their ideal properties. With advanced filtering options, including location, price range, amenities, and more, we help buyers discover homes that perfectly match their preferences.</li><br/>
                            <li>Interactive Property Maps: Explore properties with our interactive maps, allowing you to visualize their exact locations, nearby amenities, and other points of interest. Get a comprehensive view of the neighborhood and make informed decisions about the properties you're interested in.</li><br/>
                            <li>Secure and Efficient Communication: We prioritize secure and efficient communication between buyers, sellers, and real estate professionals. Our platform facilitates seamless communication channels, ensuring smooth interactions, timely updates, and effective negotiations throughout the buying and selling process.</li><br/>
                            <li>User-Friendly Interface: We pride ourselves on providing a user-friendly interface that enhances the overall user experience. With intuitive navigation, clear property information, and easy-to-use tools, we make it simple for users to navigate the platform and find their dream homes effortlessly.</li><br/>
                        </ul>
                    }
                />
            )}

            {activeTab === 'copyright' && (
                <ContentSection
                    id="copyright"
                    title="Copyright Notice"
                    content={
                        <p style={{width: '60%'}}>
                            &copy; {new Date().getFullYear()} ListingBuddy. All rights reserved. This website and its content are the property of ListingBuddy and are protected by copyright laws. Any unauthorized use, reproduction, or distribution of the content may result in legal action.
                        </p>
                    }
                />
            )}

        </div>
    );
}

export default CopyrightPage;
