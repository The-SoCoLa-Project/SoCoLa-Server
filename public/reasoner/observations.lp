%SessionId:10.
holdsAt(currentState(bottle, open), 0).
holdsAt(currentState(bottle, empty), 0).
holdsAt(currentState(bottle, opened), 0).

happens(close,1).holdsAt(currentState(bottle, opened), 0).

happens(close,1).