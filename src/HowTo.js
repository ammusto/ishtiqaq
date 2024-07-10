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
                "<span className='med-font arabic-font'>س </span>" and
                "<span className='med-font arabic-font'>ل </span>" that default to unchecked.
                The first stands for <span className='med-font arabic-font'> سابقة</span> (prefix) and can be used if you're unsure whether one of the initial characters is a prefix
                (<span className='med-font arabic-font'> ف، ل، و، ن، ي، ت، ال، ك، س </span>).
                If the initial character is one of these, then it will perform the search with this character as optional.
                The same logic applies with the second, which stands for
                <span className='med-font arabic-font'> لاحقة </span> (suffix).
                For example, if you were to search
                <span className='med-font arabic-font'> رده </span> and check this box, the results would include the roots
                <span className='med-font arabic-font'> رَدّ </span> and
                <span className='med-font arabic-font'> رَدَه </span>.
            </p>

            <img className='example-image' src={`${process.env.PUBLIC_URL}/example2.png`} alt="Example" />
            <p>This tool  includes Hans Wehr, Steingass, Lane's Lexicon, and Hava, and there are links for each of these in the root results list that will bring to ejtaal.net and the appropriate page. <strong>HW</strong> is Hans Wehr, <strong>SG</strong> is Steingass, <strong>LL</strong> is Lane's Lexicon, <strong>HA</strong> is Hava. There is also a link for <strong>CL</strong>, which stands for classical lexica, and will look up the root in several classical lexica, including Maqāyīs al-lugha, al-Ṣiḥāḥ fī al-lugha, Tāj al-ʿarūs, al-Muḥīṭ fī al-lugha, and Lisān al-ʿarab. For some words or roots, it is more beneficial to look them up alphabetically, so underneath each lemma on the left side of the search results you will find links with an <strong>(a)</strong> next to them, and these will look up the term alphabetically.</p>
            <p><strong>NB:</strong> The root dictionary definitions are not very robust and have only been lightly cleaned, so if you are not very familiar with a root's definition, please double check the dictionaries!</p>
            <p><strong>Tip:</strong> You can navigate the pages with left and right arrow for ease of use.</p>
            <p><strong>Tip:</strong> The root list used for ishtiqaq is in the process of being udpated with rare and classical roots. Therefore it is useful, especially with lesser known roots, to look them up alphabetically using the CL(a) lookup. Steingass is also quite useful for this and contains many more roots than Hans Wehr as does Hava.</p>
            <p><strong>Tip:</strong> If searching an entire rasm for a derived term (i.e. not a bare root) does not yield results that work, it is advisable to search the base root, with wildcards if you are unsure of the characters. And, in addition to any possible root matches, be sure to check the <strong>CL(a)</strong> link. For example, in the image below, the root search is
            <span className='med-font arabic-font'> أضا </span>
            which produces a single possible root result of
            <span className='med-font arabic-font'> أضض</span>. 
            However, there is a rare root not attested in HW, LL, HA, or SG that can be found in classical lexica:
            <span className='med-font arabic-font'> أضا</span>. So in this case, you would want to check the
            <span className='med-font arabic-font'> أضض</span> links and then, on the left, check the alphabetical search (a) in both the English-Arabic dictionaries as well as the classical lexica, which will search for <span className='med-font arabic-font'> أضا</span>.
            <img className='example-image' src={`${process.env.PUBLIC_URL}/example3.png`} alt="Example" />


             </p>

        </div>
    );
};

export default HowTo;
