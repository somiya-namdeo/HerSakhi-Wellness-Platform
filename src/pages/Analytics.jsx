import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import AnalyticsOverviewCards from '../components/analytics/AnalyticsOverviewCards'
import MoodEnergyChart from '../components/analytics/MoodEnergyChart'
import SymptomDistribution from '../components/analytics/SymptomDistribution'
import CycleLengthHistory from '../components/analytics/CycleLengthHistory'
import WellnessRadar from '../components/analytics/WellnessRadar'
import HealthInsights from '../components/analytics/HealthInsights'
import AIRecommendations from '../components/analytics/AIRecommendations'
import { getUserCycleLogs, getUserPredictionInsights } from '../api/analyticsApi'
import { getUser } from '../api/api'

// Map mood strings to numeric scores for charts
const MOOD_SCORE = { Happy: 8, Neutral: 5, Sad: 2 }

// Compute analytics metrics from daily logs and backend insights
const deriveAnalytics = (logs, insights) => {
  const total = logs.length

  // --- Mood & Energy series (group by week index) -------------------------
  const weekMap = {}
  logs.forEach((log) => {
    const d    = new Date(log.log_date)
    const week = `Week ${Math.ceil((d.getDate()) / 7)}`
    if (!weekMap[week]) weekMap[week] = { moods: [], pain: [] }
    if (log.mood)        weekMap[week].moods.push(MOOD_SCORE[log.mood] ?? 5)
    if (log.pain_level != null) weekMap[week].pain.push(log.pain_level)
  })

  const avg = (arr) => arr.length ? +(arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1) : null

  const moodSeries = Object.entries(weekMap).map(([week, v]) => ({
    week,
    mood:   avg(v.moods) ?? 5,
    energy: avg(v.moods) != null ? Math.max(1, (avg(v.moods) ?? 5) - 1) : 5,
    stress: avg(v.pain)  != null ? Math.round(avg(v.pain))             : 3,
  }))

  // --- Avg mood score (0-10) ---------------------------------------------
  const moodScores = logs.filter(l => l.mood).map(l => MOOD_SCORE[l.mood] ?? 5)
  const avgMoodScore = avg(moodScores) ?? 0

  // --- Wellness score (blend mood + inverse pain) ------------------------
  const painScores = logs.filter(l => l.pain_level != null).map(l => l.pain_level)
  const avgPain    = avg(painScores) ?? 5
  const wellnessScore = total > 0
    ? +((avgMoodScore * 0.6 + (10 - avgPain) * 0.4)).toFixed(1)
    : 0

  // --- Avg cycle length from insights ------------------------------------
  const avgCycleLength = insights?.predicted_cycle_length
    ?? (insights ? null : null)
    ?? 28

  // --- Cycle regularity --------------------------------------------------
  const cycleRegularity = insights?.cycle_regularity ?? 'Insufficient data'
  const regularityPct   = cycleRegularity === 'Regular'
    ? 95
    : cycleRegularity.startsWith('Analyzing')
      ? '—'
      : '—'

  // --- Symptom distribution ---------------------------------------------
  const symptomCount = {}
  logs.forEach((log) => {
    (log.symptoms || []).forEach((s) => {
      symptomCount[s] = (symptomCount[s] || 0) + 1
    })
  })
  const COLORS = ['#a78bfa', '#fbbf24', '#f9a8d4', '#c4b5fd', '#fbcfe8', '#86efac', '#7dd3fc']
  const totalSymptoms = Object.values(symptomCount).reduce((s, v) => s + v, 0)
  const symptomData = Object.entries(symptomCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], i) => ({
      name,
      value: totalSymptoms > 0 ? Math.round((count / totalSymptoms) * 100) : 0,
      color: COLORS[i % COLORS.length],
    }))

  // --- Most common symptom ----------------------------------------------
  const topSymptom = symptomData.length > 0 ? symptomData[0].name : null

  // --- Average pain level -----------------------------------------------
  const avgPainLevel = avg(painScores)

  // --- Mood trend label --------------------------------------------------
  let moodTrend = 'Not enough data'
  if (moodSeries.length >= 2) {
    const first = moodSeries[0].mood
    const last  = moodSeries[moodSeries.length - 1].mood
    if (last > first)       moodTrend = 'Improving 📈'
    else if (last < first)  moodTrend = 'Declining 📉'
    else                    moodTrend = 'Stable 📊'
  }

  // --- Wellness radar data ----------------------------------------------
  const radarData = [
    { subject: 'Sleep',      A: Math.min(100, Math.round((10 - avgPain) * 10)) },
    { subject: 'Mood',       A: Math.round((avgMoodScore / 10) * 100) },
    { subject: 'Pain',       A: Math.round(((10 - avgPain) / 10) * 100) },
    { subject: 'Regularity', A: cycleRegularity === 'Regular' ? 95 : 60 },
    { subject: 'Wellness',   A: Math.round((wellnessScore / 10) * 100) },
  ]

  // --- AI recommendations -----------------------------------------------
  const recommendations = []
  const styleCycle = ['primary', 'pink', 'peach', 'gray']
  
  if (insights?.recommendations && insights.recommendations.length > 0) {
    insights.recommendations.forEach((recText, idx) => {
      recommendations.push({
        label: idx === 0 ? 'Cycle Insight' : (idx === 1 ? 'Wellness Tip' : 'Health Suggestion'),
        text: recText,
        style: styleCycle[idx % styleCycle.length]
      })
    })
  } else {
    // Fallback if no recommendations from backend
    if (insights?.recommendation) {
      recommendations.push({ label: 'Cycle Insight', text: insights.recommendation, style: 'primary' })
    }
    if (insights?.wellness_insight) {
      recommendations.push({ label: 'Wellness Tip',  text: insights.wellness_insight, style: 'pink' })
    }
    if (topSymptom) {
      recommendations.push({
        label: 'Symptom Alert',
        text: `${topSymptom} is your most reported symptom. Consider tracking triggers and consulting your doctor if it persists.`,
        style: 'peach',
      })
    }
  }

  if (recommendations.length === 0) {
    recommendations.push(
      { label: 'Get Started', text: 'Start logging daily to unlock personalised AI recommendations tailored to your cycle.', style: 'primary' }
    )
  }

  return {
    avgCycleLength,
    cycleRegularity,
    regularityPct,
    avgMoodScore,
    wellnessScore,
    moodSeries,
    symptomData,
    topSymptom,
    avgPainLevel,
    moodTrend,
    radarData,
    recommendations,
    hasEnoughData: total >= 1,
    risk_flags: insights?.risk_flags || [],
    wellness_insight: insights?.wellness_insight || '',
    symptom_summary: insights?.symptom_summary || ''
  }
}

// Main Analytics Page Component
const Analytics = () => {
  const [cycleLogs,  setCycleLogs]  = useState([])
  const [insights,   setInsights]   = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    const user = getUser()
    if (!user?.id) {
      setError('Could not determine logged-in user. Please log in again.')
      setLoading(false)
      return
    }

    try {
      // Run both requests in parallel; predictions can fail gracefully
      const [logsRes, insightsRes] = await Promise.allSettled([
        getUserCycleLogs(user.id),
        getUserPredictionInsights(user.id),
      ])

      if (logsRes.status === 'fulfilled') {
        setCycleLogs(logsRes.value?.logs ?? [])
      } else {
        console.warn('Cycle logs fetch failed:', logsRes.reason?.message)
        setCycleLogs([])
      }

      if (insightsRes.status === 'fulfilled') {
        setInsights(insightsRes.value)
      } else {
        console.warn('Prediction insights fetch failed:', insightsRes.reason?.message)
        setInsights(null)
      }
    } catch (err) {
      setError('Failed to load analytics data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Derive computed analytics from raw data
  const analytics = deriveAnalytics(cycleLogs, insights)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
        <Sidebar />
        <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
          <Topbar title="Analytics" />
          <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Loading your analytics…</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
        <Sidebar />
        <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
          <Topbar title="Analytics" />
          <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full flex items-center justify-center">
            <div className="bg-white rounded-[30px] p-8 shadow-card border border-primary/5 text-center max-w-md">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fdf7fb] flex font-inter">
      <Sidebar />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        <Topbar title="Analytics" />
        
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full">

          {/* Empty state banner */}
          {!analytics.hasEnoughData && (
            <div className="bg-white rounded-[30px] p-6 shadow-card border border-primary/5 mb-8 text-center">
              <p className="text-gray-500 text-sm">
                Start tracking daily logs to unlock analytics. Your charts will populate as you log more data.
              </p>
            </div>
          )}

          {/* Top Overview Cards */}
          <AnalyticsOverviewCards analytics={analytics} />

          {/* Line Chart & Pie Chart Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <div className="xl:col-span-2">
              <MoodEnergyChart moodSeries={analytics.moodSeries} />
            </div>
            <div className="xl:col-span-1">
              <SymptomDistribution symptomData={analytics.symptomData} />
            </div>
          </div>

          {/* Bar Chart & Radar Chart Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <CycleLengthHistory cycleLogs={cycleLogs} insights={insights} />
            <WellnessRadar radarData={analytics.radarData} />
          </div>

          {/* Bottom Insights & Recommendations */}
          <HealthInsights analytics={analytics} cycleLogs={cycleLogs} />
          <AIRecommendations recommendations={analytics.recommendations} insights={insights} />

        </main>
      </div>
    </div>
  )
}

export default Analytics
