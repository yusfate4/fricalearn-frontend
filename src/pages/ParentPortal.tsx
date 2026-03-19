import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import { ShieldCheck, Calendar, Award } from 'lucide-react';

export default function ParentPortal() {
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        api.get('/me').then(res => setReport(res.data));
    }, []);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Parent Observation Deck</h1>
                        <p className="text-gray-500">Monitoring progress for {report?.name}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <Award className="mr-2 text-frica-gold" /> Weekly Achievement Report
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 font-medium">Vocabulary Mastery</span>
                            <span className="font-bold text-frica-green">{report?.student_profile?.total_points} Points</span>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 font-medium">Cultural Rank</span>
                            <span className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold">
                                {report?.student_profile?.rank}
                            </span>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600 font-medium">Last Active</span>
                            <span className="text-gray-800 font-bold flex items-center">
                                <Calendar size={16} className="mr-2" /> Today
                            </span>
                        </div>
                    </div>

                    <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100 italic text-blue-800 text-center">
                        "Your child is in the top 30% of Yoruba learners this week! Keep encouraging them to speak at home."
                    </div>
                </div>
            </div>
        </Layout>
    );
}