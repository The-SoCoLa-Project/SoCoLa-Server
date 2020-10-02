goalAchieved(t) :- holdsAt(currentState(bottle, open), t).
goalAchieved(t) :- holdsAt(currentState(bottle, empty), t).
