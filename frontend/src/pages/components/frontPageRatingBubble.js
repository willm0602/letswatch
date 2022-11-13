

const FrontPageRatingBubble = ({rating}) => {
    return(
        <div
                style={{
                    position: 'absolute',
                    display: 'flex',
                    justifyContent:
                        'center',
                    alignItems: 'center',
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    bottom: '0px',
                    left: '80%',
                    color: 'black',
                    backgroundColor:
                        rating > 70
                            ? '#66FF63'
                            : rating >
                                50
                            ? '#FFF963'
                            : '#FFC165',
                    padding: '5px',
                    textAlign: 'start',
                    border: '1px solid black',
                }}
            >
                <span
                    style={{
                        fontSize: '0.75em',
                    }}
                >
                    <b>{rating}</b>
                </span>
                <span
                    style={{
                        fontSize: '0.55em',
                    }}
                >
                    %
                </span>
            </div>
    )
}

export default FrontPageRatingBubble;