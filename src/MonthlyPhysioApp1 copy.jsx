import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, Cell } from "recharts";


function Card({ children, className = "" }) {
  return <div className={`bg-white shadow-md rounded-2xl p-4 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`border rounded-lg px-2 py-1 w-full text-sm ${className}`}
      {...props}
    />
  );
}

function MonthlyPhysioApp() {
  const pages = ["Physiotherapist List", "Setup", "Monthly Summary","Per Physio Summary", "Visual Chart"];
  const [currentPage, setCurrentPage] = useState("Setup");

  const [headSalary, setHeadSalary] = useState(1500);
  const [equipment, setEquipment] = useState(600);
  const [marketing, setMarketing] = useState(400);
  const [software, setSoftware] = useState(150);
  const [phoneInternet, setPhoneInternet] = useState(100);
  const [miscellaneous, setMiscellaneous] = useState(250);

  const [physioLogs, setPhysioLogs] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      name: `Physio ${i + 1}`,
      designation: '',
      selected: false,
      sessions: Array.from({ length: 4 }, (_, j) => ({
        patient: '',
        session: `Session ${j + 1}`,
        date: '',
        plan: '',
        duration: '',
        rate: 0,
        fuel: 0,
        salary: 0,
      })),
    }))
  );

  const renderSetup = () => (
    <Card>
      <CardContent className="space-y-3">
      <div className="flex flex-col gap-3 text-sm font-medium text-gray-600">
          <div>Head Salary</div>
          <Input type="number" value={headSalary} onChange={(e) => setHeadSalary(Number(e.target.value))} />
          <div>Equipment</div>
          <Input type="number" value={equipment} onChange={(e) => setEquipment(Number(e.target.value))} />
          <div>Marketing</div>
          <Input type="number" value={marketing} onChange={(e) => setMarketing(Number(e.target.value))} />
          <div>Software & CRM</div>
          <Input type="number" value={software} onChange={(e) => setSoftware(Number(e.target.value))} />
          <div>Phone & Internet</div>
          <Input type="number" value={phoneInternet} onChange={(e) => setPhoneInternet(Number(e.target.value))} />
          <div>Miscellaneous</div>
          <Input type="number" value={miscellaneous} onChange={(e) => setMiscellaneous(Number(e.target.value))} />
        </div>
      </CardContent>
    </Card>
  );

  const renderSummary = () => {
    const totalRate = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.rate || 0), 0);
    const totalFuel = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.fuel || 0), 0);
    const totalSalary = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.salary || 0), 0);

    const totalFixedExpenses = headSalary + equipment + marketing + software + phoneInternet + miscellaneous;
    const totalExpenses = totalFuel + totalSalary + totalFixedExpenses;
    const netIncome = totalRate - totalExpenses;

    return (
      <Card>
        <CardContent className="space-y-2">
          <h3 className="text-lg font-semibold">Monthly Summary</h3>
          <div>Head Salary: {headSalary} KWD</div>
          <div>Equipment: {equipment} KWD</div>
          <div>Marketing: {marketing} KWD</div>
          <div>Software & CRM: {software} KWD</div>
          <div>Phone & Internet: {phoneInternet} KWD</div>
          <div>Miscellaneous: {miscellaneous} KWD</div>
          <hr />
          <div className="font-medium">Total Income from Patients: {totalRate} KWD</div>
          <div>Total Transport & Fuel: {totalFuel} KWD</div>
          <div>Total Session-based Salary: {totalSalary} KWD</div>
          <hr />
          <div>Total Expenses: {totalExpenses} KWD</div>
          <div className="font-bold">Net Income: {netIncome} KWD</div>
        </CardContent>
      </Card>
    );
  };

  const renderPhysioList = () => (
    <Card>
      <CardContent className="space-y-3">
      <div className="grid grid-cols-1 gap-4">
          <h3 className="text-lg font-semibold">List of Physiotherapists</h3>
          <div className="space-x-2">
            <button
              className="bg-red-500 text-white text-sm px-3 py-1 rounded"
              onClick={() => {
                const updated = physioLogs.filter(p => !p.selected);
                setPhysioLogs(updated);
              }}
            >
              −
            </button>
            <button
              className="bg-green-500 text-white text-sm px-3 py-1 rounded"
              onClick={() => {
                setPhysioLogs([
                  ...physioLogs,
                  {
                    name: '',
                    designation: '',
                    selected: false,
                    sessions: Array.from({ length: 4 }, (_, j) => ({
                      patient: '',
                      session: `Session ${j + 1}`,
                      date: '',
                      plan: '',
                      duration: '',
                      rate: 0,
                      fuel: 0,
                      salary: 0,
                    })),
                  },
                ]);
              }}
            >
              + Add
            </button>
          </div>
        </div>
        <ul className="list-none space-y-2">
          {physioLogs.map((physio, idx) => (
            <li key={idx}>
              <div className="grid grid-cols-1 gap-1 border p-2 rounded-md relative pl-8">
                <input
                  type="checkbox"
                  className="absolute left-2 top-3"
                  checked={physio.selected || false}
                  onChange={(e) => {
                    const updated = physioLogs.map((p, i) => ({
                      ...p,
                      selected: i === idx ? e.target.checked : false,
                    }));
                    setPhysioLogs(updated);
                  }}
                />
                <Input
                  placeholder="Name"
                  value={physio.name}
                  onChange={(e) => {
                    const updated = [...physioLogs];
                    updated[idx].name = e.target.value;
                    setPhysioLogs(updated);
                  }}
                />
                <Input
                  placeholder="Designation"
                  value={physio.designation || ''}
                  onChange={(e) => {
                    const updated = [...physioLogs];
                    updated[idx].designation = e.target.value;
                    setPhysioLogs(updated);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="text-center pt-4">
          <button
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => {
              const selectedIndex = physioLogs.findIndex((p) => p.selected);
              if (selectedIndex !== -1) {
                setCurrentPage(`Physio ${selectedIndex + 1}`);
              }
            }}
          >
            View
          </button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPerPhysioSummary = () => {
    return (
      <Card className="w-full">
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold text-center">Per Physio Summary</h3>
          {physioLogs.map((physio, idx) => {
            const totalRate = physio.sessions.reduce((sum, s) => sum + (s.rate || 0), 0);
            const totalFuel = physio.sessions.reduce((sum, s) => sum + (s.fuel || 0), 0);
            const totalSalary = physio.sessions.reduce((sum, s) => sum + (s.salary || 0), 0);
            const netIncome = totalRate - (totalFuel + totalSalary);
  
            return (
              <div key={idx} className="border p-3 rounded-md space-y-1 bg-gray-50">
                <div className="font-semibold">{physio.name || `Physio ${idx + 1}`}</div>
                <div>Total Income: {totalRate} KWD</div>
                <div>Total Fuel: {totalFuel} KWD</div>
                <div>Total Salary: {totalSalary} KWD</div>
                <div className="font-bold">Net Profit: {netIncome} KWD</div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };
  
  const renderCurrentPage = () => {
    if (currentPage === "Visual Chart") return renderVisualChart();
    if (currentPage === "Setup") return renderSetup();
    if (currentPage === "Monthly Summary") return renderSummary();
    if (currentPage === "Per Physio Summary") return renderPerPhysioSummary();
    if (currentPage === "Physiotherapist List") return renderPhysioList();
        if (currentPage.startsWith("Physio")) {
      const index = parseInt(currentPage.split(" ")[1]) - 1;
      const treatmentPlans = ["Stroke Recovery", "Parkinson's Rehab", "Post-op Recovery", "Mobility & Fall Prevention", "Custom"];
      const durations = ["00:15", "00:30", "00:45", "01:00", "01:15", "01:30", "01:45", "02:00"];
      const amounts = [0, 5, 10, 15, 20, 25, 30, 50, 75, 100];

      return (
        <Card>
          <CardContent className="space-y-3">
          <div className="border rounded p-2 space-y-3">
              <h3 className="text-lg font-semibold">{physioLogs[index]?.name}</h3>
              <div className="space-x-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => {
                    const updated = [...physioLogs];
                    updated[index].sessions.push({
                      patient: '',
                      session: `Session ${updated[index].sessions.length + 1}`,
                      date: '',
                      plan: '',
                      duration: '',
                      rate: 0,
                      fuel: 0,
                      salary: 0,
                    });
                    setPhysioLogs(updated);
                  }}
                >
                  + Session
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => {
                    const updated = [...physioLogs];
                    if (updated[index].sessions.length > 1) {
                      updated[index].sessions.pop();
                      setPhysioLogs(updated);
                    }
                  }}
                >
                  − Session
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold">{physioLogs[index]?.name}</h3>
            {physioLogs[index].sessions.map((session, sIdx) => (
              <div key={sIdx} className="border rounded p-2 space-y-2">
                <div className="text-sm font-semibold">{session.session}</div>
                <Input
                  placeholder="Patient Name"
                  value={session.patient}
                  onChange={(e) => {
                    const updated = [...physioLogs];
                    updated[index].sessions[sIdx].patient = e.target.value;
                    setPhysioLogs(updated);
                  }}
                />
                <input
                  type="date"
                  className="w-full border rounded px-2 py-1"
                  value={session.date || ''}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    const updated = [...physioLogs];
                    updated[index].sessions[sIdx].date = newDate;
                    setPhysioLogs(updated);
                  }}
                />
                <select className="w-full border rounded px-2 py-1" value={session.plan} onChange={(e) => {
                  const updated = [...physioLogs];
                  updated[index].sessions[sIdx].plan = e.target.value;
                  setPhysioLogs(updated);
                }}>
                  <option value="">Treatment Plan</option>
                  {treatmentPlans.map(plan => <option key={plan} value={plan}>{plan}</option>)}
                </select>
                <select className="w-full border rounded px-2 py-1" value={session.duration} onChange={(e) => {
                  const updated = [...physioLogs];
                  updated[index].sessions[sIdx].duration = e.target.value;
                  setPhysioLogs(updated);
                }}>
                  <option value="">Duration</option>
                  {durations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="w-full border rounded px-2 py-1 text-gray-500" value={session.rate === 0 ? "" : session.rate} onChange={(e) => {
                  const updated = [...physioLogs];
                  updated[index].sessions[sIdx].rate = Number(e.target.value);
                  setPhysioLogs(updated);
                }}>
                  <option value="">Income (KWD)</option>
                  {amounts.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select className="w-full border rounded px-2 py-1 text-gray-500" value={session.fuel === 0 ? "" : session.fuel} onChange={(e) => {
                  const updated = [...physioLogs];
                  updated[index].sessions[sIdx].fuel = Number(e.target.value);
                  setPhysioLogs(updated);
                }}>
                  <option value="">Fuel (KWD)</option>
                  {amounts.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select className="w-full border rounded px-2 py-1 text-gray-500" value={session.salary === 0 ? "" : session.salary} onChange={(e) => {
                  const updated = [...physioLogs];
                  updated[index].sessions[sIdx].salary = Number(e.target.value);
                  setPhysioLogs(updated);
                }}>
                  <option value="">Salary (KWD)</option>
                  {amounts.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <div className="text-right font-semibold">
                  Subtotal: {(session.rate || 0) - (session.fuel || 0) - (session.salary || 0)} KWD
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const renderVisualChart = () => {
  const totalRate = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.rate || 0), 0);
  const totalFuel = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.fuel || 0), 0);
  const totalSalary = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.salary || 0), 0);
  const totalFixed = headSalary + equipment + marketing + software + phoneInternet + miscellaneous;

  const totalExpenses = totalFuel + totalSalary + totalFixed;
  const netProfit = totalRate - totalExpenses;
  const loss = netProfit < 0 ? Math.abs(netProfit) : 0;

  const chartData = [
    { label: 'Total Income', value: totalRate, type: 'income' },
    { label: 'Net Profit', value: netProfit, type: 'profit' },
    { label: 'Loss', value: -loss, type: 'loss' },
    { label: 'Fuel', value: -totalFuel, type: 'expense' },
    { label: 'Salary', value: -totalSalary, type: 'expense' },
    { label: 'Fixed Costs', value: -totalFixed, type: 'expense' }
  ];

  const getColor = (type) => {
    if (type === 'income') return '#38a169'; // Green
    if (type === 'profit') return '#3182ce'; // Blue
    if (type === 'loss') return '#e53e3e'; // Red
    if (type === 'expense') return '#f56565'; // Light Red
    return '#3182ce';
  };

const renderCustomizedLabel = ({ x, y, width, value }) => {
  const fontSize = 10;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fontSize={fontSize}
      textAnchor="middle"
      fill="#555"
    >
      {value}
    </text>
  );
};


  return (
    <Card>
      <CardContent className="space-y-3">
        <h3 className="text-lg font-semibold">Monthly Overview</h3>
        <div className="w-full h-72">
          <BarChart width={320} height={280} data={chartData}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.type)} />
              ))}
              <LabelList dataKey="value" content={renderCustomizedLabel} />
            </Bar>
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
};

  
      

    
  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold text-center">Monthly Physio Care Budget App</h2>
      <div className="flex flex-wrap justify-center gap-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 rounded text-sm ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {page}
          </button>
        ))}
      </div>
      {renderCurrentPage()}
    </div>
  );
}

export default MonthlyPhysioApp;
