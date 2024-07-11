import React, { useEffect, useState } from 'react';
import Graph from './Graph';
import { db, auth } from '../firebaseConfig';
import { useAlert } from '../Context/AlertContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { RefreshRounded , ReplyOutlined} from '@mui/icons-material';

const Stats = ({ wpm, resetTest, accuracy, correctChars, incorrectChars, missedChars, extraChars, graphData }) => {
    var timeSet = new Set();
    const { setAlert } = useAlert();
    const newGraph = graphData.filter((i) => {
        if (!timeSet.has(i[0])) {
            timeSet.add(i[0]);
            return i;
        }
        return null; // Added return null to satisfy filter's callback requirements
    });

    const [user] = useAuthState(auth);
    const [show, setShow] = useState(false); // state to control hovering div

    const pushResultToDatabase = () => {
        const resultsRef = db.collection('Results');
        const { uid } = auth.currentUser;
        if (!isNaN(accuracy)) {
            resultsRef.add({
                wpm: wpm,
                accuracy: accuracy,
                characters: `${correctChars}/${incorrectChars}/${missedChars}/${extraChars}`,
                userID: uid,
                timeStamp: new Date()
            }).then((response) => {
                setAlert({
                    open: true,
                    type: 'success',
                    message: 'Result saved to db'
                });
            });
        } else {
            setAlert({
                open: true,
                type: 'error',
                message: 'Invalid test'
            });
        }
    };

    useEffect(() => {
        if (user) {
            pushResultToDatabase(); // saving because user has logged in 
        } else {
            setAlert({ // no user no save 
                open: true,
                type: 'warning',
                message: 'Login to save results'
            });
        }
    }, [user]);

    return (
        <div className="stats-box">
            <div className="left-stats">
                <div className="title">WPM</div>
                <div className="subtitle">{wpm}</div>
                <div className="title">Accuracy</div>
                <div className="subtitle">{accuracy}%</div>
                <div className="title">Characters</div>
                {show && <div className='hover'>correct, incorrect, extra, and missed</div>}
                <div className="subtitle" onMouseOver={() => setShow(true)} onMouseOut={() => setShow(false)}>
                    {correctChars}/{incorrectChars}/{missedChars}/{extraChars}
                </div>
                <div className='reload' onClick={resetTest}><RefreshRounded />&nbsp;Retake </div>
            </div>
            <div className="right-stats">
                <Graph graphData={newGraph} />
            </div>
        </div>
    );
};

export default Stats;
