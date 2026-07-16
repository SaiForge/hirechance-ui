import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div className="flex-grow flex flex-col w-full bg-surface-bright">
            <section className="bg-inverse-surface text-surface-bright p-margin-mobile md:p-margin-desktop border-b-2 border-primary shrink-0">
                <div className="max-w-[1440px] mx-auto w-full">
                    <h1 className="font-h1-mobile md:font-h1 uppercase">Dashboard</h1>
                    <p className="font-body-lg mt-unit opacity-90">Overview of your prediction metrics and history.</p>
                </div>
            </section>
            
            <div className="p-margin-mobile md:p-margin-desktop flex flex-col gap-stack-lg max-w-[1440px] mx-auto w-full flex-grow">
                {/* Stats Row */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    <div className="bg-surface-bright border-2 border-inverse-surface border-t-[4px] border-t-primary-container p-gutter rounded relative">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">Current Score</span>
                        <div className="font-h2 text-h2 text-on-background">78%</div>
                        <div className="absolute top-gutter right-gutter">
                            <span className="material-symbols-outlined text-primary-container" data-icon="trending_up">trending_up</span>
                        </div>
                    </div>
                    <div className="bg-surface-bright border-2 border-inverse-surface border-t-[4px] border-t-secondary-container p-gutter rounded relative">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">Last Prediction</span>
                        <div className="font-h2 text-h2 text-on-background">High</div>
                        <div className="absolute top-gutter right-gutter">
                            <span className="material-symbols-outlined text-secondary-container" data-icon="history">history</span>
                        </div>
                    </div>
                    <div className="bg-surface-bright border-2 border-inverse-surface border-t-[4px] border-t-tertiary-container p-gutter rounded relative">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">Total Predictions</span>
                        <div className="font-h2 text-h2 text-on-background">12</div>
                        <div className="absolute top-gutter right-gutter">
                            <span className="material-symbols-outlined text-tertiary-container" data-icon="functions">functions</span>
                        </div>
                    </div>
                    <div className="bg-surface-bright border-2 border-inverse-surface border-t-[4px] border-t-primary p-gutter rounded relative">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">Peer Rank</span>
                        <div className="font-h2 text-h2 text-on-background">Top 15%</div>
                        <div className="absolute top-gutter right-gutter">
                            <span className="material-symbols-outlined text-primary" data-icon="leaderboard">leaderboard</span>
                        </div>
                    </div>
                </section>

                {/* Complex Layout: Chart & Table */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    {/* Score History Chart */}
                    <div className="lg:col-span-2 border-2 border-inverse-surface bg-surface-bright rounded overflow-hidden flex flex-col min-h-[300px]">
                        <div className="bg-inverse-surface text-surface-bright p-stack-sm px-gutter border-b-2 border-inverse-surface">
                            <h3 className="font-label-caps text-label-caps uppercase">Score History</h3>
                        </div>
                        <div className="flex-grow p-gutter relative bg-surface-bright min-h-[250px]">
                            {/* SVG Chart Representation */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible p-gutter" preserveAspectRatio="none" viewBox="0 0 500 200">
                                {/* Grid Lines */}
                                <line opacity="0.3" stroke="#77786b" strokeDasharray="4" strokeWidth="1" x1="0" x2="500" y1="50" y2="50"></line>
                                <line opacity="0.3" stroke="#77786b" strokeDasharray="4" strokeWidth="1" x1="0" x2="500" y1="100" y2="100"></line>
                                <line opacity="0.3" stroke="#77786b" strokeDasharray="4" strokeWidth="1" x1="0" x2="500" y1="150" y2="150"></line>
                                {/* Area Fill */}
                                <polygon fill="#e2f4c8" opacity="0.5" points="0,200 0,160 100,120 200,140 300,80 400,90 500,40 500,200"></polygon>
                                {/* Angular Line */}
                                <polyline fill="none" points="0,160 100,120 200,140 300,80 400,90 500,40" stroke="#283618" strokeWidth="2" vectorEffect="non-scaling-stroke"></polyline>
                                {/* Square Points */}
                                <rect fill="#dda15e" height="8" stroke="#283618" strokeWidth="2" width="8" x="-4" y="156"></rect>
                                <rect fill="#dda15e" height="8" stroke="#283618" strokeWidth="2" width="8" x="96" y="116"></rect>
                                <rect fill="#dda15e" height="8" stroke="#283618" strokeWidth="2" width="8" x="196" y="136"></rect>
                                <rect fill="#dda15e" height="8" stroke="#283618" strokeWidth="2" width="8" x="296" y="76"></rect>
                                <rect fill="#dda15e" height="8" stroke="#283618" strokeWidth="2" width="8" x="396" y="86"></rect>
                                <rect fill="#dda15e" height="8" stroke="#283618" strokeWidth="2" width="8" x="496" y="36"></rect>
                            </svg>
                        </div>
                    </div>

                    {/* History Table */}
                    <div className="border-2 border-inverse-surface bg-surface-bright rounded overflow-hidden flex flex-col">
                        <div className="bg-inverse-surface text-surface-bright p-stack-sm px-gutter border-b-2 border-inverse-surface flex justify-between items-center">
                            <h3 className="font-label-caps text-label-caps uppercase">Recent Runs</h3>
                        </div>
                        <div className="flex-grow bg-surface-bright p-0">
                            <table className="w-full text-left font-body-md border-collapse">
                                <thead>
                                    <tr className="bg-primary-container text-surface-bright font-label-caps text-label-caps uppercase">
                                        <th className="p-2 border-b-2 border-inverse-surface">Date</th>
                                        <th className="p-2 border-b-2 border-inverse-surface">CGPA</th>
                                        <th className="p-2 border-b-2 border-inverse-surface">Score</th>
                                        <th className="p-2 border-b-2 border-inverse-surface">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b-2 border-inverse-surface hover:bg-surface-variant transition-colors">
                                        <td className="p-2">12/10</td>
                                        <td className="p-2">8.2</td>
                                        <td className="p-2">78%</td>
                                        <td className="p-2"><Link to="#" className="font-bold text-secondary uppercase hover:underline">View -&gt;</Link></td>
                                    </tr>
                                    <tr className="border-b-2 border-inverse-surface hover:bg-surface-variant transition-colors">
                                        <td className="p-2">10/10</td>
                                        <td className="p-2">8.1</td>
                                        <td className="p-2">72%</td>
                                        <td className="p-2"><Link to="#" className="font-bold text-secondary uppercase hover:underline">View -&gt;</Link></td>
                                    </tr>
                                    <tr className="hover:bg-surface-variant transition-colors">
                                        <td className="p-2">01/09</td>
                                        <td className="p-2">7.9</td>
                                        <td className="p-2">65%</td>
                                        <td className="p-2"><Link to="#" className="font-bold text-secondary uppercase hover:underline">View -&gt;</Link></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
