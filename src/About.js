import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className='about p10 m-auto'>
            <h2>About The Project</h2>
            <p>Work in progress for looking up arabic words and roots, including wildcards, inspired by <a href="https://www.lexiqamus.com/en">LexiQamus</a>. This project utilizes indices from <a href="https://www.ejtaal.net">ejtaal.net</a> as well as a <a href="https://github.com/alsaydi/root-ext-service/blob/main/data/word-root-table.txt">flatfile database</a> of
                arabic words and their roots collected by <a href="https://github.com/alsaydi">Abdalaziz Alsaydi</a> and a noun list made by <a href="https://github.com/linuxscout/arramooz/">Taha Zerrouki</a>. Dictionary data was scraped from an OCR'd version of Hans Wehr and from the <a href="https://www.livingarabic.com/">Living Arabic Project</a>.</p>
            <h2>To-Do List</h2>
            <ul>
                <li>Add Classical Lexica</li>
                <li>Add bug report feature</li>
                <li>Add feature to add roots/term not included in master root/term list</li>
                <li>Add Arabic localization</li>
            </ul>
            <h2>About Me</h2>
            <p>
                My name is Antonio Musto, and I'm a PhD candidate at NYU in the Middle Eastern and Islamic Studies department.
                You can learn more about my work at <a href="https://nyu.academia.edu/AntonioMusto">academia.edu</a> and my <a href="https://github.com/ammusto">github</a>.
                You can also follow me on twitter <a href="https://x.com/deepcutiqtibas">@deepcutiqtibas</a>.
            </p>
        </div>
    );
};

export default About;
