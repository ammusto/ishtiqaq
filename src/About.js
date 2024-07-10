import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className='about p10 m-auto'>
            <h2>About The Project</h2>
            <p>There are a variety of searchable Arabic dictionaries available online, which is *not* the focus of this tool, even though ishtiqāq shares much of this functionality. At its core, ishtiqāq is an aid for reading manuscripts where you come across a rasm (consonantal skeleton) that is unclear or whose letters are ambiguous. With ishtiqāq you can mark unclear letter(s) and, with a single search, retrieve multiple results based on the different possible spellings of the word. To learn more about the functionality, check the How To page.</p>
            <p>This tool was in inspired by <a href="https://www.lexiqamus.com/en">LexiQamus</a>, and utilizes indices from <a href="https://www.ejtaal.net">ejtaal.net</a>, a <a href="https://github.com/alsaydi/root-ext-service/blob/main/data/word-root-table.txt">flatfile database</a> of
                arabic words and their roots collected by <a href="https://github.com/alsaydi">Abdalaziz Alsaydi</a>, and a noun list made by <a href="https://github.com/linuxscout/arramooz/">Taha Zerrouki</a>. English dictionary data was scraped from an OCR'd version of Hans Wehr and from the <a href="https://www.livingarabic.com/">Living Arabic Project</a>, and the classical lexica were scraped from al-maktaba <a href="www.shamela.ws">al-shamela</a> and <a href="https://www.lesanarab.com/">lesanarab.com</a>.</p>
            <h2>Recent Updates</h2>
            <ul>
                <li>Added a link to <a href="https://www.maajim.com">maajim.com</a> in results</li>
                <li>Added al-Muḥīṭ fī al-lugha and Lisān al-ʿArab</li>
                <li>Added Tār al-ʿarūs and Maqāyīs al-lugha</li>
                <li>Added Lane's Lexicon and Hava look up</li>
            </ul>
            <h2>Known Issues</h2>
            <ul>
                <li>The root list needs to be updated to include rare classical roots.</li>
            </ul>
            <h2>To-Do List</h2>
            <ul>
                <li>Update root list.</li>
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
