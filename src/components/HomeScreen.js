import GameFooterContent from './GameFooterContent';
import GameIcon from './GameIcon';

export default function HomeScreen() {
    return (
        <div className="home">
            <h1>Puzzles</h1>
            <div className="game-grid">
                <GameIcon name='Figure' icon='🔢' backgroundColor='#adcce0' destination='/figure' />
            </div>
            <GameFooterContent showReturnHome={false} />
        </div>
    );
}
