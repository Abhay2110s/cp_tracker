import React from 'react';
import { Award, CheckCircle2, XCircle } from 'lucide-react';

export default function SubmissionsTable() {
  const recentSubmissions = [
    { name: 'Problem A - Watermelon', platform: 'Codeforces', verdict: 'Accepted', time: '5m ago', success: true },
    { name: 'Problem B - Long Words', platform: 'Codeforces', verdict: 'Wrong Answer', time: '7m ago', success: false },
    { name: 'Problem C - Registration System', platform: 'Codeforces', verdict: 'Wrong Answer', time: '9m ago', success: false },
    { name: 'Problem A - Watermelon', platform: 'Codeforces', verdict: 'Accepted', time: '12m ago', success: true },
  ];

  return (
    <div className="bg-[#141922] border border-gray-800/60 rounded-xl p-6 shadow-xl h-full">
      <div className="flex items-center gap-2.5 border-b border-gray-800 pb-4 mb-4">
        <Award className="w-5 h-5 text-cyan-400" />
        <h3 className="text-base font-semibold text-white tracking-wide">Recent Submissions</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-400 min-w-[500px]">
          <thead>
            <tr className="text-[11px] text-gray-500 uppercase tracking-wider border-b border-gray-800/60 pb-2">
              <th className="pb-3 font-semibold">Problem Name</th>
              <th className="pb-3 font-semibold">Platform</th>
              <th className="pb-3 font-semibold">Verdict</th>
              <th className="pb-3 font-semibold text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/30">
            {recentSubmissions.map((sub, idx) => (
              <tr key={idx} className="hover:bg-gray-800/10 group transition-colors">
                <td className="py-3.5 text-gray-200 font-medium group-hover:text-cyan-400 transition-colors">
                  {sub.name}
                </td>
                <td className="py-3.5 text-gray-400">{sub.platform}</td>
                <td className="py-3.5">
                  <span className={`inline-flex items-center gap-1.5 font-semibold ${
                    sub.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {sub.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {sub.verdict}
                  </span>
                </td>
                <td className="py-3.5 text-right font-mono text-gray-500 group-hover:text-gray-400 transition-colors">
                  {sub.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}