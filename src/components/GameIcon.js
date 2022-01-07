import { useNavigate } from 'react-router-dom';
import './GameIcon.css';



export default function GameIcon(props) {
    const { backgroundColor, destination, icon, name } = props;

    let navigate = useNavigate();

    function handleClick() {
        navigate(destination);
    }

    return (
        <div className='game-icon' style={{ backgroundColor }} onClick={ handleClick }>
            <div className='game-icon-symbol'>{icon}</div>
            <div className='game-icon-title'>{name}</div>
        </div>
    );
}
