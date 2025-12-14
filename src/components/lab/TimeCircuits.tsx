import { useEffect, useState } from 'react';

const formatDate = (date: Date) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const hour = (date.getHours() % 12 || 12).toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return { month, day, year, hour, min };
};

const CircuitDisplay = ({ label, date, color }: { label: string, date: any, color: 'red' | 'green' | 'amber' }) => {
    const colorClass = {
        red: 'text-foreground/80',
        green: 'text-foreground',
        amber: 'text-foreground/60',
    }[color];

    return (
        <div className="p-4 bg-neutral/50 border border-neutral-light rounded-xl text-center">
            <p className={`font-heading text-sm mb-2 ${colorClass}`}>{label}</p>
            <div className="flex justify-center gap-2 font-mono text-3xl">
                <span>{date.month}</span>
                <span>{date.day}</span>
                <span>{date.year}</span>
            </div>
             <div className="flex justify-center gap-2 font-mono text-2xl mt-1 opacity-80">
                <span>{date.hour}</span>
                <span>:</span>
                <span>{date.min}</span>
            </div>
        </div>
    );
};

export function TimeCircuits() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const destinationTime = { month: 'OCT', day: '21', year: '2099', hour: '04', min: '29' };
    const lastDeparture = { month: 'OCT', day: '26', year: '1985', hour: '01', min: '21' };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <CircuitDisplay label="Destination Time" date={destinationTime} color="red" />
            <CircuitDisplay label="Present Time" date={formatDate(currentTime)} color="green" />
            <CircuitDisplay label="Last Time Departed" date={lastDeparture} color="amber" />
        </div>
    );
}