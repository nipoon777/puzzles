import { Link } from "react-router-dom";

export default function GameFooterContent(props) {

    const { showReturnHome = true } = props;

    return (
        <div>
            <hr />
            <div className="footer-text">
                { showReturnHome && <Link to='/'>All Puzzles</Link> }
                <a href="mailto:puzzles@brianyu.me">Email</a>
            </div>
        </div>
    );
}
