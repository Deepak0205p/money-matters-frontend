"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Zap, ArrowRight, TrendingUp } from 'lucide-react';

function AnimatedFlowchart({ data, color = '#059669' }) {
  const nodes = data?.nodes || [];
  const edges = data?.edges || [];
  return (
    <div className="relative w-full overflow-x-auto py-4 px-2 my-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
      <div className="relative min-w-[320px] h-48 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge, i) => (
            <motion.path
              key={`edge-${i}`}
              d={edge.path}
              stroke={color}
              strokeWidth="2"
              strokeDasharray="4,4"
              fill="none"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
            />
          ))}
        </svg>
        {nodes.map((node, i) => (
          <motion.div
            key={`node-${i}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            style={{
              position: 'absolute',
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: `${node.width || 75}px`,
              height: `${node.height || 36}px`
            }}
            className="flex items-center justify-center rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-sm transition-transform hover:scale-105"
          >
            {node.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AnimatedPieChart({ data, color = '#059669' }) {
  const slices = data?.slices || [{ label: 'Needs', value: 50, color: '#059669' }, { label: 'Wants', value: 30, color: '#D97706' }, { label: 'Savings', value: 20, color: '#2563EB' }];
  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-4 p-4 my-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" />
          <motion.circle
            cx="18" cy="18" r="15.915" fill="none" stroke={color} strokeWidth="4"
            strokeDasharray="50, 100" strokeDashoffset="0" strokeLinecap="round"
            initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: "50, 100" }} transition={{ duration: 1 }}
          />
        </svg>
        <span className="absolute text-xs font-bold text-slate-800">50/30/20</span>
      </div>
      <div className="space-y-1.5 text-xs">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color || color }} />
            <span className="text-slate-600 font-medium">{s.label}:</span>
            <span className="text-slate-900 font-bold">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnimatedBarChart({ data, color = '#059669' }) {
  const items = data?.items || [];
  return (
    <div className="p-4 my-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-2.5">
      {items.map((it, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 font-medium">{it.label}</span>
            <span className="font-bold text-slate-900">{it.value}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: it.color || color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, it.percentage || 60)}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnimatedDecisionTree({ data, color = '#7C3AED' }) {
  return (
    <div className="p-4 my-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Decision Flow</h4>
      <div className="flex items-center gap-2 text-xs text-slate-800">
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-semibold text-emerald-800">{data?.root || 'Decision'}</span>
        <ArrowRight size={14} className="text-slate-400" />
        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 font-semibold text-indigo-800">{data?.branch || 'Outcome'}</span>
      </div>
    </div>
  );
}

function AnimatedTimeline({ data, color = '#D97706' }) {
  return (
    <div className="p-4 my-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-2">
      <div className="text-xs font-bold text-amber-700">{data?.title || 'Timeline'}</div>
      <p className="text-xs text-slate-600 leading-relaxed">{data?.description || ''}</p>
    </div>
  );
}

function AnimatedComparisonCard({ data, color = '#059669' }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 my-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs text-xs">
      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <div className="font-bold text-slate-800">{data?.leftTitle || 'Option A'}</div>
        <p className="text-slate-500 mt-1">{data?.leftDesc || ''}</p>
      </div>
      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
        <div className="font-bold text-emerald-800">{data?.rightTitle || 'Option B'}</div>
        <p className="text-emerald-700/80 mt-1">{data?.rightDesc || ''}</p>
      </div>
    </div>
  );
}

function AnimatedStatHighlight({ data, color = '#059669' }) {
  return (
    <div className="p-4 my-3 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs flex items-center gap-3">
      <div className="text-2xl font-black text-emerald-700 tabular-nums">{data?.stat || '₹0'}</div>
      <div className="text-xs text-slate-700 font-medium leading-tight">{data?.text || ''}</div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════════════
// RAINBOW COLORS
// ════════════════════════════════════════════════════════════════════════
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const RAINBOW_COLORS = ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#0ABDE3', '#10AC84', '#5F27CD', '#EE5A24', '#6C5CE7', '#FDA7DF', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F0E68C', '#FF6348', '#7BED9F', '#70A1FF', '#FFA502', '#FF6B81', '#2ED573', '#1E90FF', '#FF4757', '#ECCC68', '#A4B0BE'];

// ════════════════════════════════════════════════════════════════════════
// RICH CONTENT PARSER
// ════════════════════════════════════════════════════════════════════════
const boldColors = ['#FBBF24', '#22D3EE', '#34D399', '#F472B6', '#A78BFA'];
function parseInline(text, color) {
  const parts = [];
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|(₹[\d,./+\-% ]+)/g;
  let last = 0;
  let m;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) {
      const highlightColor = boldColors[key % boldColors.length];
      parts.push(/*#__PURE__*/_jsx("strong", {
        className: "font-black drop-shadow-[0_0_8px_rgba(251,191,36,0.15)]",
        style: { color: highlightColor },
        children: m[1]
      }, key++));
    } else if (m[2]) parts.push(/*#__PURE__*/_jsx("em", {
      className: "text-slate-700 italic",
      children: m[2]
    }, key++));else if (m[3]) parts.push(/*#__PURE__*/_jsx("code", {
      className: "bg-slate-100 text-emerald-800 px-1 py-0.5 rounded text-[12px] font-mono border border-slate-200",
      children: m[3]
    }, key++));else if (m[4]) parts.push(/*#__PURE__*/_jsx("span", {
      className: "font-bold",
      style: {
        color
      },
      children: m[4]
    }, key++));
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
export function RichContent({
  content,
  color
}) {
  const lines = content.split('\n');
  const blocks = [];
  const [checkedItems, setCheckedItems] = useState({});
  let i = 0;
  let blockKey = 0;
  const toggleCheck = id => setCheckedItems(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
  while (i < lines.length) {
    const line = lines[i];
    if (line.includes(': *') || line.includes('**') && line.includes(':')) {
      const match = line.match(/^([\w ]+): (.*)$/);
      if (match) {
        const name = match[1];
        const text = match[2];
        const isBhaiya = name.toLowerCase().includes('bhai') || name.toLowerCase().includes('mentor');
        blocks.push(/*#__PURE__*/_jsxs(motion.div, {
          initial: {
            opacity: 0,
            x: isBhaiya ? 20 : -20
          },
          animate: {
            opacity: 1,
            x: 0
          },
          className: `flex flex-col mb-4 ${isBhaiya ? 'items-end' : 'items-start'}`,
          children: [/*#__PURE__*/_jsx("span", {
            className: "text-[10px] font-bold text-slate-500 mb-1 px-2 uppercase tracking-wider",
            children: name
          }), /*#__PURE__*/_jsx("div", {
            className: `max-w-[85%] px-4 py-3 rounded-2xl text-[15.5px] sm:text-[17.5px] font-semibold leading-relaxed shadow-2xs ${isBhaiya ? 'rounded-tr-none' : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none'}`,
            style: isBhaiya ? {
              backgroundColor: `${color}ee`,
              color: '#000'
            } : {},
            children: parseInline(text, isBhaiya ? '#000' : color)
          })]
        }, blockKey++));
        i++;
        continue;
      }
    }
    if (line.includes('🚨') && (line.includes('MISSION') || line.includes('ALERT'))) {
      const missionTitle = line.trim();
      i++;
      const missionLines = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('🚨')) {
        missionLines.push(lines[i].trim());
        i++;
      }
      blocks.push(/*#__PURE__*/_jsxs(motion.div, {
        initial: {
          scale: 0.95,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        className: "my-6 p-5 rounded-2xl border-2 border-dashed relative overflow-hidden bg-amber-50/60 shadow-2xs",
        style: {
          borderColor: `${color}40`
        },
        children: [/*#__PURE__*/_jsx("div", {
          className: "absolute top-0 right-0 p-2 opacity-10",
          children: /*#__PURE__*/_jsx(Zap, {
            size: 40,
            style: {
              color
            }
          })
        }), /*#__PURE__*/_jsx("h4", {
          className: "text-sm font-black tracking-tighter uppercase mb-3 flex items-center gap-2",
          style: {
            color
          },
          children: missionTitle
        }), /*#__PURE__*/_jsx("div", {
          className: "space-y-3",
          children: missionLines.map((mLine, mi) => {
            const isCheckbox = mLine.startsWith('[ ]') || mLine.startsWith('[]');
            const cleanLine = mLine.replace(/^\[\s?\]\s?/, '');
            const id = `mission-${blockKey}-${mi}`;
            if (isCheckbox) {
              return /*#__PURE__*/_jsxs("div", {
                className: "flex items-start gap-3 cursor-pointer group",
                onClick: () => toggleCheck(id),
                children: [/*#__PURE__*/_jsx("div", {
                  className: `mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${checkedItems[id] ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white group-hover:border-slate-400'}`,
                  children: checkedItems[id] && /*#__PURE__*/_jsx(CheckCircle2, {
                    size: 12,
                    className: "text-white"
                  })
                }), /*#__PURE__*/_jsx("span", {
                  className: `text-[13px] leading-snug transition-all ${checkedItems[id] ? 'text-slate-400 line-through' : 'text-slate-800 font-medium'}`,
                  children: parseInline(cleanLine, color)
                })]
              }, mi);
            }
            return /*#__PURE__*/_jsx("p", {
              className: "text-[13px] text-slate-700 leading-relaxed font-medium",
              children: parseInline(mLine, color)
            }, mi);
          })
        })]
      }, blockKey++));
      continue;
    }
    if (line.trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && (lines[i].trim().startsWith('|') || lines[i].trim() === '')) {
        if (lines[i].trim().startsWith('|')) tableLines.push(lines[i]);
        i++;
      }
      const rowLines = tableLines.filter(l => !l.match(/^\|\s*[-:]+\s*(\|\s*[-:]+\s*)*\|?$/));
      if (rowLines.length > 0) {
        const rows = rowLines.map(l => l.split('|').slice(1, -1).map(cell => cell.trim()));
        const isHeader = rowLines.length > 1 && tableLines[1]?.match(/^\|\s*[-:]+/);
        blocks.push(/*#__PURE__*/_jsx("div", {
          className: "overflow-x-auto rounded-xl border border-slate-200 mt-3 mb-2 shadow-2xs",
          children: /*#__PURE__*/_jsx("table", {
            className: "w-full text-[12px] border-collapse bg-white",
            children: /*#__PURE__*/_jsx("tbody", {
              children: rows.map((row, ri) => /*#__PURE__*/_jsx("tr", {
                className: ri === 0 && isHeader ? 'border-b border-slate-200 bg-slate-50' : ri % 2 === 0 ? 'bg-slate-50/50' : '',
                children: row.map((cell, ci) => ri === 0 && isHeader ? /*#__PURE__*/_jsx("th", {
                  className: "px-3 py-2 text-left font-bold text-slate-800",
                  style: {
                    color: ci === 0 ? color : undefined
                  },
                  children: parseInline(cell, color)
                }, ci) : /*#__PURE__*/_jsx("td", {
                  className: `px-3 py-2 text-slate-700 ${ci === 0 ? 'font-semibold' : ''}`,
                  children: parseInline(cell, color)
                }, ci))
              }, ri))
            })
          })
        }, blockKey++));
      }
      continue;
    }
    if (line.trim() === '') {
      i++;
      continue;
    }
    if (line.match(/^[A-Z][A-Z0-9 ()]{5,}$/) && !line.includes('₹')) {
      blocks.push(/*#__PURE__*/_jsx("p", {
        className: "text-[10px] font-extrabold tracking-[0.15em] uppercase mt-4 mb-1",
        style: {
          color
        },
        children: line
      }, blockKey++));
      i++;
      continue;
    }
    if (line.trim().match(/^[-•*✅❌]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].trim().match(/^[-•*✅❌]\s/)) {
        items.push(lines[i].trim().replace(/^[-•*✅❌]\s/, ''));
        i++;
      }
      blocks.push(/*#__PURE__*/_jsx("ul", {
        className: "space-y-1.5 mt-2 mb-2",
        children: items.map((item, idx) => /*#__PURE__*/_jsxs("li", {
          className: "flex gap-2 text-slate-800 text-[15.5px] sm:text-[17.5px] font-semibold leading-relaxed",
          children: [/*#__PURE__*/_jsx("span", {
            className: "mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full",
            style: {
              backgroundColor: color
            }
          }), /*#__PURE__*/_jsx("span", {
            children: parseInline(item, color)
          })]
        }, idx))
      }, blockKey++));
      continue;
    }
    if (line.trim().match(/^\d+[.)] /)) {
      const items = [];
      while (i < lines.length && lines[i].trim().match(/^\d+[.)] /)) {
        items.push(lines[i].trim().replace(/^\d+[.)] /, ''));
        i++;
      }
      blocks.push(/*#__PURE__*/_jsx("ol", {
        className: "space-y-2 mt-2 mb-2",
        children: items.map((item, idx) => /*#__PURE__*/_jsxs("li", {
          className: "flex gap-2.5 text-slate-800 text-[15.5px] sm:text-[17.5px] font-semibold leading-relaxed",
          children: [/*#__PURE__*/_jsx("span", {
            className: "flex-shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
            style: {
              backgroundColor: `${color}20`,
              color
            },
            children: idx + 1
          }), /*#__PURE__*/_jsx("span", {
            className: "pt-0.5",
            children: parseInline(item, color)
          })]
        }, idx))
      }, blockKey++));
      continue;
    }
    if (line.includes('↓') || line.includes('→') || line.includes('←') || line.includes('↑')) {
      blocks.push(/*#__PURE__*/_jsx("p", {
        className: "text-slate-500 text-[12px] leading-relaxed font-mono pl-2 my-0.5",
        children: parseInline(line, color)
      }, blockKey++));
      i++;
      continue;
    }

    // --- VISUAL COMPONENT PARSING ---
    if (line.trim().startsWith('{{visual:')) {
      let jsonString = line.trim().substring(9);
      
      // If it doesn't end on the same line, collect until '}}'
      if (!jsonString.endsWith('}}')) {
        i++;
        while (i < lines.length && !lines[i].trim().endsWith('}}')) {
          jsonString += lines[i];
          i++;
        }
        if (i < lines.length) {
          jsonString += lines[i].trim().slice(0, -2); // remove '}}'
        }
      } else {
        jsonString = jsonString.slice(0, -2); // remove '}}'
      }
      
      try {
        const visualData = JSON.parse(jsonString);
        const { type, data } = visualData;
        
        blocks.push(
          <div key={`visual-${blockKey++}`} className="my-2">
            {type === 'flowchart' && <AnimatedFlowchart data={data} color={color} />}
            {type === 'piechart' && <AnimatedPieChart data={data} color={color} />}
            {type === 'barchart' && <AnimatedBarChart data={data} color={color} />}
            {type === 'decisiontree' && <AnimatedDecisionTree data={data} color={color} />}
            {type === 'timeline' && <AnimatedTimeline data={data} color={color} />}
            {type === 'comparison' && <AnimatedComparisonCard data={data} color={color} />}
            {type === 'stathighlight' && <AnimatedStatHighlight data={data} color={color} />}
          </div>
        );
      } catch (err) {
        console.error("Failed to parse visual data:", err);
      }
      i++;
      continue;
    }

    blocks.push(/*#__PURE__*/_jsx("p", {
      className: "text-slate-800 text-[16px] sm:text-[18px] leading-relaxed font-semibold",
      children: parseInline(line, color)
    }, blockKey++));
    i++;
  }
  return /*#__PURE__*/_jsx("div", {
    className: "space-y-1 font-mono",
    children: blocks
  });
}

// ════════════════════════════════════════════════════════════════════════
// RAINBOW PROGRESS BAR
// ════════════════════════════════════════════════════════════════════════
export function RainbowProgress({
  currentIndex,
  totalCount
}) {
  return /*#__PURE__*/_jsx("div", {
    className: "flex items-center gap-[2px] px-4 pt-3 pb-1 flex-shrink-0",
    children: Array.from({
      length: totalCount
    }).map((_, i) => {
      const isCompleted = i <= currentIndex;
      const isCurrent = i === currentIndex;
      const color = RAINBOW_COLORS[i % RAINBOW_COLORS.length];
      return /*#__PURE__*/_jsx("div", {
        className: "h-[3px] rounded-full flex-1 transition-all duration-300",
        style: {
          backgroundColor: isCompleted ? color : 'rgba(255,255,255,0.08)',
          opacity: isCurrent ? 1 : isCompleted ? 0.7 : 0.15,
          boxShadow: isCurrent ? `0 0 6px ${color}60` : 'none'
        }
      }, i);
    })
  });
}

// ════════════════════════════════════════════════════════════════════════
// INTERACTIVE VIEWERS
// ════════════════════════════════════════════════════════════════════════
export function InteractiveQuizViewer({
  data,
  color
}) {
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const handleSelect = index => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "mt-6 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4",
    children: [/*#__PURE__*/_jsx("h4", {
      className: "text-[15px] font-bold text-slate-900",
      children: data.question
    }), /*#__PURE__*/_jsx("div", {
      className: "space-y-2",
      children: data.options.map((option, i) => {
        const isCorrect = i === data.correctAnswerIndex;
        const isSelected = selected === i;
        let bgColor = 'bg-slate-50';
        let borderColor = 'border-slate-200';
        if (selected !== null) {
          if (isCorrect) {
            bgColor = 'bg-emerald-50';
            borderColor = 'border-emerald-500/50';
          } else if (isSelected) {
            bgColor = 'bg-rose-50';
            borderColor = 'border-rose-500/50';
          }
        }
        return /*#__PURE__*/_jsxs(motion.button, {
          whileTap: {
            scale: 0.98
          },
          onClick: () => handleSelect(i),
          className: `w-full p-3 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${bgColor} ${borderColor} ${selected === null ? 'hover:bg-slate-100/70' : ''}`,
          children: [/*#__PURE__*/_jsx("span", {
            className: isSelected || selected !== null && isCorrect ? 'text-slate-900 font-semibold' : 'text-slate-700 font-medium',
            children: option
          }), selected !== null && isCorrect && /*#__PURE__*/_jsx(CheckCircle2, {
            size: 16,
            className: "text-emerald-600"
          }), selected !== null && isSelected && !isCorrect && /*#__PURE__*/_jsx(X, {
            size: 16,
            className: "text-rose-500"
          })]
        }, i);
      })
    }), /*#__PURE__*/_jsx(AnimatePresence, {
      children: showExplanation && /*#__PURE__*/_jsx(motion.div, {
        initial: {
          opacity: 0,
          height: 0
        },
        animate: {
          opacity: 1,
          height: 'auto'
        },
        className: "pt-2 border-t border-slate-200",
        children: /*#__PURE__*/_jsxs("p", {
          className: "text-[13px] text-slate-600 leading-relaxed italic",
          children: [/*#__PURE__*/_jsx("span", {
            className: "font-bold not-italic text-emerald-800",
            children: "Bhai, simple hai:"
          }), " ", data.explanation]
        })
      })
    })]
  });
}
export function InteractiveCalculatorViewer({
  data,
  color
}) {
  const [values, setValues] = useState(() => {
    const initial = {};
    data.inputs.forEach(input => {
      initial[input.label] = input.defaultValue;
    });
    return initial;
  });
  const calculateResult = () => {
    const {
      calcType
    } = data;
    if (calcType === 'compounding') {
      const p = values['Principal'] || values['Monthly SIP'] || 0;
      const r = (values['Interest Rate (%)'] || 0) / 100;
      const t = values['Years'] || 0;
      if (data.formula === 'sip') {
        const mr = r / 12;
        const m = t * 12;
        return Math.round(p * ((Math.pow(1 + mr, m) - 1) / mr) * (1 + mr));
      }
      return Math.round(p * Math.pow(1 + r, t));
    }
    if (calcType === 'inflation') {
      const p = values['Current Amount'] || 0;
      const r = (values['Inflation Rate (%)'] || 0) / 100;
      const t = values['Years'] || 0;
      return Math.round(p / Math.pow(1 + r, t));
    }
    if (calcType === 'rule72') {
      const r = values['Interest Rate (%)'] || 1;
      return parseFloat((72 / r).toFixed(1));
    }
    if (calcType === 'emi') {
      const p = values['Loan Amount'] || 0;
      const r = (values['Interest Rate (%)'] || 0) / 1200;
      const n = values['Months'] || 1;
      return Math.round(p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    }
    return 0;
  };
  const result = calculateResult();
  return /*#__PURE__*/_jsxs("div", {
    className: "mt-6 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-6",
    children: [/*#__PURE__*/_jsx("div", {
      className: "space-y-5",
      children: data.inputs.map((input, i) => /*#__PURE__*/_jsxs("div", {
        className: "space-y-2",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex justify-between items-center",
          children: [/*#__PURE__*/_jsx("label", {
            className: "text-xs font-semibold text-slate-500 uppercase tracking-wider",
            children: input.label
          }), /*#__PURE__*/_jsxs("span", {
            className: "text-sm font-bold text-slate-900",
            children: [input.unit === '₹' ? '₹' : '', values[input.label].toLocaleString(), input.unit !== '₹' ? ` ${input.unit || ''}` : '']
          })]
        }), /*#__PURE__*/_jsx("input", {
          type: "range",
          min: input.min,
          max: input.max,
          step: input.step,
          value: values[input.label],
          onChange: e => setValues(prev => ({
            ...prev,
            [input.label]: parseFloat(e.target.value)
          })),
          className: "w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600",
          style: {
            accentColor: color || '#059669'
          }
        })]
      }, i))
    }), /*#__PURE__*/_jsxs("div", {
      className: "pt-5 border-t border-slate-200 text-center",
      children: [/*#__PURE__*/_jsx("p", {
        className: "text-[10px] font-extrabold tracking-[0.2em] uppercase mb-1 text-slate-500",
        children: "Result"
      }), /*#__PURE__*/_jsxs(motion.div, {
        initial: {
          scale: 0.9,
          opacity: 0
        },
        animate: {
          scale: 1,
          opacity: 1
        },
        className: "text-3xl font-black text-slate-900",
        children: [data.calcType === 'rule72' ? '' : '₹', result.toLocaleString(), data.calcType === 'rule72' ? ' Years' : '']
      }, result), /*#__PURE__*/_jsx("p", {
        className: "text-[11px] font-medium text-slate-500 mt-2",
        children: data.calcType === 'compounding' ? 'Total Wealth Created 🚀' : data.calcType === 'inflation' ? 'Purchasing Power left 📉' : data.calcType === 'rule72' ? 'Time to double your money ⏳' : data.calcType === 'emi' ? 'Monthly EMI amount 💸' : 'Calculated Value'
      })]
    })]
  });
}
export function InteractiveChoiceViewer({
  data
}) {
  const [selected, setSelected] = useState(null);
  return /*#__PURE__*/_jsxs("div", {
    className: "mt-6 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4",
    children: [/*#__PURE__*/_jsxs("h4", {
      className: "text-[15px] font-bold text-slate-900 italic",
      children: ["\" ", data.scenario, " \""]
    }), /*#__PURE__*/_jsx("div", {
      className: "grid grid-cols-1 gap-3",
      children: data.choices.map((choice, i) => /*#__PURE__*/_jsxs(motion.button, {
        whileTap: {
          scale: 0.98
        },
        onClick: () => setSelected(i),
        className: `p-4 rounded-xl border text-left transition-all ${selected === i ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'}`,
        children: [/*#__PURE__*/_jsx("div", {
          className: "text-sm font-bold text-slate-900 mb-1",
          children: choice.text
        }), /*#__PURE__*/_jsx(AnimatePresence, {
          children: selected === i && /*#__PURE__*/_jsxs(motion.div, {
            initial: {
              opacity: 0,
              height: 0
            },
            animate: {
              opacity: 1,
              height: 'auto'
            },
            className: "text-[12px] text-slate-600 leading-relaxed mt-2 pt-2 border-t border-slate-200",
            children: [/*#__PURE__*/_jsx("span", {
              className: `font-bold ${choice.isCorrect ? 'text-emerald-700' : 'text-rose-600'}`,
              children: choice.isCorrect ? 'Sahi Choice! ✅' : 'Khatra! ❌'
            }), /*#__PURE__*/_jsx("p", {
              className: "mt-1",
              children: choice.consequence
            })]
          })
        })]
      }, i))
    })]
  });
}