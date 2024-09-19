import React from 'react';
import { Certificate } from '..';
import { useSelector } from 'react-redux';

export default function GenerateCertificate() {
    const { certificateData } = useSelector((state) => state.certificate);

    if (!certificateData) return <p>Loading...</p>;

    const { name, university, course, issueDate, courseID } = certificateData;

    return (
        <Certificate
            name={name}
            university={university}
            course={course}
            issueDate={issueDate}
            courseID={courseID}
        />
    );
}
