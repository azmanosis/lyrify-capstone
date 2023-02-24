import './Footer.scss';
import github from '../../assets/icons/github-mark-white.svg';
import linkedin from '../../assets/png/linkedin_white.png';

function Footer() {
    return (
        <>
            <div className='footer'>
                <p className="footer__text">built by azeem contractor | </p>
                <a href='https://github.com/azmanosis/lyrify-capstone' target='_blank' rel='noopener noreferrer'>
                    <img src={github} alt="GitHub" className='footer__git' />
                </a>
                <p className="footer__text"> | </p>
                <a href='https://www.linkedin.com/in/azeemcontractor/' target='_blank' rel='noopener noreferrer'>
                    <img src={linkedin} alt="LinkedIn" className='footer__linkedin' />
                </a>
            </div>
        </>
    )
}
export default Footer;