import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className='about'>
            <h2>About The Project</h2>
            <p>Work in progress for looking up arabic words and roots, including wildcards. This project utilizes
                indices from <a href="https://www.ejtaal.net">ejtaal.net</a> as well as a <a href="https://github.com/alsaydi/root-ext-service/blob/main/data/word-root-table.txt">flatfile database</a> of
                 arabic words and their roots collected by <a href="https://github.com/alsaydi">Abdalaziz Alsaydi</a></p>
            <h2>How to Use</h2>
            <p>Type in the term you are trying to look up, you can use * to represent a single character wildcard.
                If you want to limit your search to include just a specific character or set of characters, you can click on the character in the "preview" that appears that you want to provide alternatives for.
                For those working with manuscripts, there are letters that often resemble each other. For example, د can look like a ر or even a و, and so on. When you click on a character to provide alternatives, you will notice common
                alternatives are provided for ease of use.</p>
                <img src={`${process.env.PUBLIC_URL}/example.png`} alt="Example" />
                <p>Currently, this tool only includes Hans Wehr and Steingass dictionaries, and there are links for each of these in the root results list that will bring to ejtaal.net and the appropriate page.
                For some words, it is more beneficial to look them up alphabetically, so underneath each lemma on the left side of the search results you will find links with an (a) next to them, and these will look up the
                term alphabetically</p>
            <h2>To-Do List</h2>
            <ul>
                <li>Add Lane's Lexicon and Hava</li>
                <li>Add Classical Lexica</li>
                <li>Fine tune UI</li>
                <li>Add bug report feature</li>
                <li>Add feature to add roots/term not included in master root/term list</li>
                <li>Add Arabic localization</li>
                <li>Clean up CSS</li>
            </ul>
            <h2>Known Bugs</h2>
            <ul>
                <li>Issue using * wildcard at times</li>
            </ul>
            <h2>About Me</h2>
            <p>
                My name is Antonio Musto, and I am a PhD candidate at NYU in the Middle Eastern and Islamic Studies department.
                You can learn more about my work at <a href="https://nyu.academia.edu/AntonioMusto">academia.edu</a> and my <a href="https://github.com/ammusto">github</a>.
                You can also follow me on twitter <a href="https://x.com/deepcutiqtibas">@deepcutiqtibas</a>.
            </p>
        </div>
    );
};

export default About;
