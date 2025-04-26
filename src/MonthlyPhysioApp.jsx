import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
       
       const pages = ["Home", "Physiotherapist List", "Setup", "Monthly Summary", "Per Physio Summary", "Visual Chart"];
       const [currentPage, setCurrentPage] = useState("Home");


  const [headSalary, setHeadSalary] = useState(1500);
  const [equipment, setEquipment] = useState(600);
  const [marketing, setMarketing] = useState(400);
  const [software, setSoftware] = useState(150);
  const [phoneInternet, setPhoneInternet] = useState(100);
  const [miscellaneous, setMiscellaneous] = useState(250);
  
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

const getMonthName = (monthIndex) => {
  return new Date(0, monthIndex).toLocaleString('default', { month: 'long' });
};

const generateFileName = () => {
  const monthName = getMonthName(selectedMonth);
  return `MonthlySummary-${monthName}-${selectedYear}`;
};

  
const updateDatesBasedOnMonthYear = (month, year) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  setFromDate(formatDate(firstDay));
  setToDate(formatDate(lastDay));
};





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

  const exportSummaryToExcel = () => {
  const totalRate = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.rate || 0), 0);
  const totalFuel = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.fuel || 0), 0);
  const totalSalary = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.salary || 0), 0);
  const totalFixedExpenses = headSalary + equipment + marketing + software + phoneInternet + miscellaneous;
  const totalExpenses = totalFuel + totalSalary + totalFixedExpenses;
  const netIncome = totalRate - totalExpenses;

  const summaryData = [
    { Item: "Period Start", Amount: fromDate },
    { Item: "Period End", Amount: toDate },
    { Item: "Month", Amount: getMonthName(selectedMonth) },
    { Item: "Year", Amount: selectedYear },
    { Item: "Head Salary", Amount: headSalary },
    { Item: "Equipment", Amount: equipment },
    { Item: "Marketing", Amount: marketing },
    { Item: "Software & CRM", Amount: software },
    { Item: "Phone & Internet", Amount: phoneInternet },
    { Item: "Miscellaneous", Amount: miscellaneous },

    // 📋 Add Per Physio Summaries
    ...physioLogs.flatMap(physio => {
      const income = physio.sessions.reduce((sum, s) => sum + (s.rate || 0), 0);
      const fuel = physio.sessions.reduce((sum, s) => sum + (s.fuel || 0), 0);
      const salary = physio.sessions.reduce((sum, s) => sum + (s.salary || 0), 0);
      const profit = income - (fuel + salary);
      return [
        { Item: `Summary for ${physio.name || "Unnamed Physio"}`, Amount: "" },
        { Item: "Total Income", Amount: income },
        { Item: "Total Fuel", Amount: fuel },
        { Item: "Total Salary", Amount: salary },
        { Item: "Net Profit", Amount: profit }
      ];
    }),

    // 📋 Then Monthly Totals
    { Item: "Total Income from Patients", Amount: totalRate },
    { Item: "Total Transport & Fuel", Amount: totalFuel },
    { Item: "Total Session-based Salary", Amount: totalSalary },
    { Item: "Total Expenses", Amount: totalExpenses },
    { Item: "Net Income", Amount: netIncome },
  ];

  const worksheet = XLSX.utils.json_to_sheet(summaryData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
  XLSX.writeFile(workbook, `${generateFileName()}.xlsx`);

};
  

  const exportSummaryToPDF = () => {
  const totalRate = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.rate || 0), 0);
  const totalFuel = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.fuel || 0), 0);
  const totalSalary = physioLogs.flatMap(p => p.sessions).reduce((sum, s) => sum + (s.salary || 0), 0);
  const totalFixedExpenses = headSalary + equipment + marketing + software + phoneInternet + miscellaneous;
  const totalExpenses = totalFuel + totalSalary + totalFixedExpenses;
  const netIncome = totalRate - totalExpenses;

  const doc = new jsPDF();
  const monthName = getMonthName(selectedMonth);
   doc.text(`Monthly Summary for ${monthName} ${selectedYear}`, 20, 10);
   doc.text(`Period: ${fromDate} to ${toDate}`, 20, 20);


  const bodyData = [
    ["Head Salary", headSalary],
    ["Equipment", equipment],
    ["Marketing", marketing],
    ["Software & CRM", software],
    ["Phone & Internet", phoneInternet],
    ["Miscellaneous", miscellaneous],

    // 📋 Add Per Physio Summaries
    ...physioLogs.flatMap(physio => {
      const income = physio.sessions.reduce((sum, s) => sum + (s.rate || 0), 0);
      const fuel = physio.sessions.reduce((sum, s) => sum + (s.fuel || 0), 0);
      const salary = physio.sessions.reduce((sum, s) => sum + (s.salary || 0), 0);
      const profit = income - (fuel + salary);
      return [
        [`Summary for ${physio.name || "Unnamed Physio"}`, ""],
        ["Total Income", income],
        ["Total Fuel", fuel],
        ["Total Salary", salary],
        ["Net Profit", profit]
      ];
    }),

    // 📋 Then Monthly Totals
    ["Total Income from Patients", totalRate],
    ["Total Transport & Fuel", totalFuel],
    ["Total Session-based Salary", totalSalary],
    ["Total Expenses", totalExpenses],
    ["Net Income", netIncome],
  ];

  autoTable(doc, {
    head: [["Item", "Amount"]],
    body: bodyData,
  });

  doc.save(`${generateFileName()}.pdf`);

};
  
 
  
  const renderSetup = () => (
    <Card>
      <CardContent className="space-y-3">
      <div className="flex flex-col gap-3 text-sm font-medium text-gray-600">
  
<div>Select Month</div>
<select
  className="border rounded-lg px-2 py-1 w-full text-sm"
  value={selectedMonth}
  onChange={(e) => {
    const newMonth = parseInt(e.target.value);
    setSelectedMonth(newMonth);
    updateDatesBasedOnMonthYear(newMonth, selectedYear);
  }}
>
  {Array.from({ length: 12 }, (_, i) => (
    <option key={i} value={i}>
      {new Date(0, i).toLocaleString('default', { month: 'long' })}
    </option>
  ))}
</select>

<div>Select Year</div>
<select
  className="border rounded-lg px-2 py-1 w-full text-sm"
  value={selectedYear}
  onChange={(e) => {
    const newYear = parseInt(e.target.value);
    setSelectedYear(newYear);
    updateDatesBasedOnMonthYear(selectedMonth, newYear);
  }}
>
  {Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return (
      <option key={year} value={year}>
        {year}
      </option>
    );
  })}
</select>

<div>From Date</div>
<Input
  type="text"
  readOnly
  value={fromDate}
  className="bg-gray-100"
/>

<div>To Date</div>
<Input
  type="text"
  readOnly
  value={toDate}
  className="bg-gray-100"
/>

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

        <h3 className="text-lg font-semibold">Monthly Summary</h3>

        {/* 📅 Add this below heading */}
           <div className="text-xs text-gray-500">
            {fromDate && toDate ? `Period: ${fromDate} to ${toDate}` : "No period selected"}
         </div>

        

        {/* ✅ Paste buttons here */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={exportSummaryToExcel}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Export Excel
          </button>
          <button
            onClick={exportSummaryToPDF}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Export PDF
          </button>
        </div>

        {/* ✅ Your Summary Items */}
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

  const renderHome = () => (
  <Card className="text-center space-y-4">
    <h1 className="text-2xl font-bold text-blue-700">Monthly Physio Care App</h1>
    <p className="text-gray-600">
      <em>"Empowering Healing, One Step at a Time"</em>
    </p>
    <p className="text-gray-700 text-sm">
      Welcome to a new journey of care, connection, and success. As a physiotherapist, your work changes lives — restoring strength, mobility, and hope to every patient. 
      This app supports your passion by helping you manage sessions, track progress, and celebrate every victory. 
      Every session you lead is a step toward someone's better future. 
      Let's build a community of excellence where your skills shine, and your efforts are recognized. 
      Keep moving, keep healing, keep inspiring!
    </p>
    <button
      onClick={() => setCurrentPage("Physiotherapist List")}
      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
    >
      Get Started
    </button>
  </Card>
);


  
  const renderCurrentPage = () => {
    
    if (currentPage === "Home") return renderHome();
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
                      date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`,

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
                        value={session.date ? session.date : `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`}
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
