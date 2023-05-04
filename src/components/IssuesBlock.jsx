import React from 'react'


function IssuesBlock({ issue, days }) {
    return (
        <div>
            <div className="issue">
                <div className="issue__content">
                    <b>Title name:</b> {issue.title}
                    <div style={{ margin: '10px 0' }}>
                        <span style={{ paddingRight: '20px' }}><b>Id:</b> #{issue.number}.</span>
                        Opened <b>{days(issue.created_at)}</b> days ago
                    </div>
                    <div>
                        <b>Role:</b> {issue.user.type} |  {issue.comments}
                    </div>
                </div>
            </div>
        </div>
    )
}



export default IssuesBlock



    // < div >
    // <div className="issue">
    //     <div className="issue__content">
    //         <div style={{ color: 'black', }}>
    //             <b>{boards.issue.title}</b>
    //         </div>
    //         <div style={{ margin: '5px 0 5px 0' }}>
    //             #{boards.issue.number}. {`Opened ${mill} days ago`}
    //         </div>
    //         <div>
    //             {boards.issue.user.type} | {`Comments: ${boards.issue.comments}`}
    //         </div>
    //     </div>
    // </div>