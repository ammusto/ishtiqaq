import React from 'react';
import './About.css';

const HowTo = () => {
    return (
        <div className='about p10 m-auto'>
            <h2>How to Use</h2>
            <p>Type in the term you're trying to look up, you can use an asterisk (*) to represent a single character wildcard.
                If you want to limit your search to include just a specific character or set of characters, you can click on the character in the "preview" that appears that you want to provide alternatives for.
                For those working with manuscripts, there are letters that often resemble each other. For example, د can look like a ر or even a و, and so on. When you click on a character to provide alternatives, you will notice common
                alternatives are provided for ease of use. However, you can add additional characters if you'd like by typing it in the empty box and clicking the "+" sign. When you add additional letters, you will notice a number like (2) appear next to a character. This
                number denotes how many total characters are being searched.</p>
            <img className='example-image' src={`${process.env.PUBLIC_URL}/example.png`} alt="Example" />
            <p>
                There are two checkboxes,
                "<span className='med-font arabic-font'> أ</span>" and
                "<span className='med-font arabic-font'> ة</span>" that default to checked.
                The first will normalize
                <span className='med-font arabic-font'> إ، أ،</span> and
                <span className='med-font arabic-font'> آ</span> as
                <span className='med-font arabic-font'> ا</span>.
                Meaning, if you search with
                <span className='med-font arabic-font'> ا</span> it will match results with the other three.
                The second checkbox,
                <span className='med-font arabic-font'>ة</span>,
                will match any
                <span className='med-font arabic-font'> ة</span> with
                <span className='med-font arabic-font'> ه</span> and vice versa.
                So searching
                <span className='med-font arabic-font'>نعمه</span>, for example, will also match
                <span className='med-font arabic-font'>نعمة</span>.
            </p>
            <p>
                There are two checkboxes,
                "<span className='med-font arabic-font'>س</span>" and
                "<span className='med-font arabic-font'>ل</span>" that default to unchecked.
                The first stands for <span className='med-font arabic-font'> سابقة</span> (prefix) and can be used if you're unsure whether one of the initial characters is a prefix
                (<span className='med-font arabic-font'> ف، ل، و، ن، ي، ت، ال، ك، س </span>).
                If the initial character is one of these, then it will perform the search with this character as optional.
                The same logic applies with the second, which stands for
                <span className='med-font arabic-font'> لاحقة</span> (suffix).
                For example, if you were to search
                <span className='med-font arabic-font'> رده</span> and check this box, the results would include the roots
                <span className='med-font arabic-font'> رَدّ</span> and
                <span className='med-font arabic-font'> رَدَه</span>.
            </p>

            <img className='example-image' src={`${process.env.PUBLIC_URL}/example2.png`} alt="Example" />
            <p>Currently, this tool only includes Hans Wehr, Steingass, Lane's Lexicon, and Hava, and there are links for each of these in the root results list that will bring to ejtaal.net and the appropriate page. <strong>HW</strong> is Hans Wehr, <strong>SG</strong> is Steingass, <strong>LL</strong> is Lane's Lexicon, and <strong>HA</strong> is Hava. For some words, it is more beneficial to look them up alphabetically, so underneath each lemma on the left side of the search results you will find links with an <strong>(a)</strong> next to them, and these will look up the term alphabetically.</p>
            <p><strong>NB:</strong> The root dictionary is not very robust and has only been lightly cleaned, so if you are not very familiar with a root's definition, please double check the dictionaries!</p>
            <p><strong>Tip:</strong> You can navigate the pages with left and right arrow for ease of use.</p>
        </div>
    );
};

export default HowTo;
