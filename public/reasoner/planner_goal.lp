goal1Achieved(t) :- holdsAt(currentState(bottle, open), t).
goal2Achieved(t) :- holdsAt(currentState(bottle, empty), t).
goalAchieved(t) :- goal1Achieved(t), goal2Achieved(t).
:- query(t), not goalAchieved(t).
:- query(t), happens(E,t), event(E).
a :- holdsAt(_,4).
-a :- holdsAt(_,4).
