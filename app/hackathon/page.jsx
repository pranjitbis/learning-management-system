"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import style from "./style.module.css";
import Nav from "../components/Header/Page"

export default function Leaderboard() {
  const [hackathonData, setHackathonData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rank");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchHackathonData = async () => {
    try {
      const res = await fetch("/api/hackthon");
      
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const data = await res.json();
      setHackathonData(data);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setHackathonData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathonData();
  }, []);

  // Filter data based on search term
  const filteredData = hackathonData.filter(participant => 
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data based on selected column and order
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "rank") {
      // Handle null ranks by putting them at the end
      if (a.rank === null) return 1;
      if (b.rank === null) return -1;
      
      return sortOrder === "asc" ? a.rank - b.rank : b.rank - a.rank;
    } else if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === "email") {
      return sortOrder === "asc" 
        ? a.email.localeCompare(b.email) 
        : b.email.localeCompare(a.email);
    }
    return 0;
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getRankDisplay = (rank) => {
    if (rank === null || rank === undefined) return "-";
    
    if (rank % 100 >= 11 && rank % 100 <= 13) {
      return `${rank}th`;
    }
    
    switch (rank % 10) {
      case 1: return `${rank}st`;
      case 2: return `${rank}nd`;
      case 3: return `${rank}rd`;
      default: return `${rank}th`;
    }
  };

  const getRankClass = (rank) => {
    if (rank === 1) return style.gold;
    if (rank === 2) return style.silver;
    if (rank === 3) return style.bronze;
    return "";
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  if (isLoading) {
    return (
      <div className={style.container}>
        <div className={style.loadingContainer}>
          <div className={style.spinner}></div>
          <p>Loading hackathon data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <>
      <Nav />
      </>
      <div className={style.header}>
        <div className={style.headerContent}>
          <h1 className={style.title}>Hackathon Leaderboard</h1>
          <p className={style.subtitle}>Celebrating innovation and excellence</p>
        </div>
        <div className={style.headerGraphic}></div>
      </div>

      <div className={style.content}>
        <div className={style.statsCard}>
          <div className={style.stat}>
            <span className={style.statNumber}>{hackathonData.length}</span>
            <span className={style.statLabel}>Total Participants</span>
          </div>
          <div className={style.stat}>
            <span className={style.statNumber}>
              {hackathonData.filter(p => p.rank !== null).length}
            </span>
            <span className={style.statLabel}>Ranked</span>
          </div>
          <div className={style.stat}>
            <span className={style.statNumber}>
              {hackathonData.filter(p => p.rank !== null && p.rank <= 3).length}
            </span>
            <span className={style.statLabel}>Top Performers</span>
          </div>
        </div>

        <div className={style.controls}>
          <div className={style.searchBox}>
            <span className={style.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={style.searchInput}
            />
          </div>
          
          <div className={style.sortButtons}>
            <button 
              className={`${style.sortBtn} ${sortBy === "rank" ? style.active : ""}`}
              onClick={() => handleSort("rank")}
            >
              Rank {sortBy === "rank" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
            <button 
              className={`${style.sortBtn} ${sortBy === "name" ? style.active : ""}`}
              onClick={() => handleSort("name")}
            >
              Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>

        <div className={style.leaderboardContainer}>
          {sortedData.length > 0 ? (
            <div className={style.leaderboard}>
              <div className={style.tableHeader}>
                <div className={style.headerCell} style={{width: '15%'}}>Rank</div>
                <div className={style.headerCell} style={{width: '45%'}}>Participant</div>
                <div className={style.headerCell} style={{width: '30%'}}>Contact</div>
                <div className={style.headerCell} style={{width: '10%'}}>Achievement</div>
              </div>
              
              <div className={style.tableBody}>
                {sortedData.map((participant, index) => (
                  <div 
                    key={participant.id} 
                    className={`${style.tableRow} ${getRankClass(participant.rank)}`}
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className={style.tableCell} style={{width: '15%'}}>
                      <div className={style.rank}>
                        <span className={style.rankNumber}>
                          {getRankDisplay(participant.rank)}
                        </span>
                      </div>
                    </div>
                    
                    <div className={style.tableCell} style={{width: '45%'}}>
                      <div className={style.participant}>
                        <div className={style.avatar}>
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <div className={style.participantInfo}>
                          <div className={style.name}>{participant.name}</div>
                          {participant.rank <= 10 && (
                            <div className={style.badge}>
                              Top 10 Performer
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={style.tableCell} style={{width: '30%'}}>
                      <a 
                        href={`mailto:${participant.email}`} 
                        className={style.email}
                      >
                        {participant.email}
                      </a>
                    </div>
                    
                    <div className={style.tableCell} style={{width: '10%'}}>
                      <div className={style.achievement}>
                        <span className={style.medal}>
                          {getMedalIcon(participant.rank)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={style.emptyState}>
              <div className={style.emptyIcon}>🏆</div>
              <h3>No participants yet</h3>
              <p>Be the first to join this hackathon!</p>
              <button 
                onClick={() => router.push("/login")} 
                className={style.ctaButton}
              >
                Join Hackathon
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}