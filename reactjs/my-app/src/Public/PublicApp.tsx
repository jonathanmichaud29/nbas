import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext }from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth";
import { batch, useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { addPublicLeagues, addPublicLeagueSeasons,/*  setPublicLeague, setPublicLeagueSeason */ } from "../redux/publicContextSlice";

import { auth } from "../Firebase/firebase";

import { ILeague, ILeagueSeason } from "../Interfaces/league";

import { IApiSetUserFirebaseTokenParams, setUserFirebaseToken } from "../ApiCall/users";
import { fetchLeagues, IApiFetchLeaguesParams } from "../ApiCall/leagues";
import { IApiFetchLeagueSeasonsParams, fetchLeagueSeasons } from "../ApiCall/seasons";

import LoaderInfo from "../Generic/LoaderInfo";

/* import { getStoragePublicLeagueId, getStoragePublicLeagueSeasonId, setStoragePublicLeagueId, setStoragePublicLeagueSeasonId } from "../utils/localStorage"; */
import { getLeagueAndSeason } from "../utils/dataFilter";
import { castNumber } from "../utils/castValues";

// TODO Remove or move those in the AdminApp
type TAdminData = {
  leagueSeason: ILeagueSeason;
  isAdmin: boolean;
}
export function useAdminData() {
  return useOutletContext<TAdminData>()
}

type TPublicContext = {
  league: ILeague;
  leagueSeason: ILeagueSeason;
}



export function usePublicContext() {
  return useOutletContext<TPublicContext>()
}

function PublicApp() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate()
  
  const [user, loading] = useAuthState(auth);
  const [adminValidate, setAdminValidate] = useState<boolean>(false);
  const [dataRetrieved, setDataRetrieved] = useState<boolean>(false);
  
  const statePublicContext = useSelector((state: RootState) => state.publicContext )
  
  const crumbs = location.pathname.split('/')
    .filter((crumb) => crumb !== '');
  const [league, leagueSeason] = getLeagueAndSeason(statePublicContext.leagues, statePublicContext.leagueSeasons, crumbs.length > 0 ? castNumber(crumbs[0]) : 0);
  
  useEffect(() => {
    if ( ! dataRetrieved ) return;
    if( crumbs[0] && ! ( league && leagueSeason) ) {
      navigate('/');
    } 
  },[crumbs, dataRetrieved, league, leagueSeason, navigate])

  useEffect(() => {
    if (loading) return;
    if (user) {
      user.getIdToken().then(token=>{
        window.localStorage.setItem('userToken', token);
        
        const paramsSetUserFirebaseToken: IApiSetUserFirebaseTokenParams = {
          email: user.email || '',
          token: token,
        }
        setUserFirebaseToken(paramsSetUserFirebaseToken)
          .catch(error => {
            window.localStorage.clear();
          })
          .finally(() => {
            batch(() => {
              /* setAdminData(true) */
              setAdminValidate(true);
            })
          })
      })
    }
    else {
      window.localStorage.clear();
      setAdminValidate(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if( ! adminValidate ){
      return;
    }
    let listLeagues: ILeague[] = [];
    let listLeagueSeasons: ILeagueSeason[] = [];
    /* let currentLeague: ILeague;
    let currentLeagueSeason: ILeagueSeason; */

    const paramsFetchLeagues: IApiFetchLeaguesParams = {
      allLeagues:true
    }
    fetchLeagues(paramsFetchLeagues)
      .then(response => {
        listLeagues = response.data;
        const leagueIds = listLeagues.map((league) => league.id) || [];
        const paramsFetchLeagueSeasons: IApiFetchLeagueSeasonsParams = {
          leagueIds: leagueIds
        }
        fetchLeagueSeasons(paramsFetchLeagueSeasons)
          .then(response => {
            listLeagueSeasons = response.data;
          })
          .catch(error => {
            
          })
          .finally(() => {
            /* const publicLeagueId = getStoragePublicLeagueId();
            const publicLeagueSeasonId = getStoragePublicLeagueSeasonId();
            let newLeagueId = 0;
            let newLeagueSeasonId = 0;
            if( publicLeagueId === 0 || publicLeagueSeasonId === 0 ){
              currentLeague = listLeagues[0];
              newLeagueId = currentLeague.id;
              
              listLeagueSeasons.sort((a,b) => b.id - a.id).every((leagueSeason) => {
                if( leagueSeason.idLeague === newLeagueId){
                  newLeagueSeasonId = leagueSeason.id;
                  return false;
                }
                return true;
              })
            }
            else {
              newLeagueId = publicLeagueId;
              newLeagueSeasonId = publicLeagueSeasonId;
            }
            if( newLeagueId !== 0 ){
              currentLeague = listLeagues.filter((league) => league.id === newLeagueId)[0];
            }
            if( newLeagueSeasonId !== 0 ){
              currentLeagueSeason = listLeagueSeasons.filter((leagueSeason) => leagueSeason.id === newLeagueSeasonId)[0];
            } */
            batch(()=>{
              // setStoragePublicLeagueId(newLeagueId);
              // setStoragePublicLeagueSeasonId(newLeagueSeasonId);
              dispatch(addPublicLeagues(listLeagues));
              dispatch(addPublicLeagueSeasons(listLeagueSeasons));
              // dispatch(setPublicLeague(currentLeague));
              // dispatch(setPublicLeagueSeason(currentLeagueSeason));
              setDataRetrieved(true);
            })
          });
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  }, [dispatch, adminValidate]);

  return (
    <>
      <LoaderInfo
        isLoading={dataRetrieved}
        hasWrapper={true}
      />
      { dataRetrieved ? (
        <Outlet 
          context={{
            league: league,
            leagueSeason: leagueSeason
          }} 
        />
      ) : ''}
    </>
  )
}
export default PublicApp;