function PuzzleIndicatorDot(props) {
    const { attempted, successful } = props;
    const style = {
        display: 'inline-block',
        height: '20px',
        width: '20px',
        backgroundColor: attempted ? (successful ? '#5bba76' : '#bf6443') : '#dbd9d3',
        borderRadius: '20px',
        marginRight: '2px',
        marginLeft: '2px',
    };
    return (
        <span style={style}></span>
    );
}

export default function MultiPuzzleIndicator(props) {
    const { results, total } = props;

    return (
        <div>
            { [...Array(total)].map((_, i) =>
                <PuzzleIndicatorDot
                    key={i}
                    attempted={results.length > i}
                    successful={results[i] ?? false}
                />
            ) }
        </div>
    );
}
