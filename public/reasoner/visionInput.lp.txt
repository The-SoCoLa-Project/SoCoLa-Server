%% Input format from Vision
%% detectedObjState(<videoID>, <objLabel>, <stateLabel>, <"before"/"after">).
%% detectedAction(<videoID>, <actionLabel>, <objLabel> [optional]).


detectedObjState(1,knife, onTable, before).
detectedAction(1, pickingUp, knife).
detectedObjState(1,knife, carries, after).

% Note 1: actions are written in gerund ( -ing), states with present perfect or as nouns. On second thought, I lean towards changing this.
% Note 2: Only specify what is being detected, not what is not being detected
% Note 3: Add only what has been learned, i.e., after processing the dataset, filtering out data with low confidence etc
% Note 4: Use the object category (class label), e.g., knife, DO NOT use the object id, e.g., knife1.
% Note 4: No empty spaces, no underscore, between words, e.g., "pickingUp", instead of "picking Up"



%%%% Axiomatization based on Vision

%%%% Fluent Definitions
fluent(currentState(Obj, State)) :-
   detectedObjState(_, Obj, State, _).



%%%% Event Definitions
event(Action) :-
   detectedAction(_, Action, _).



initiates(Action, currentState(Obj, State), T) :-
   detectedAction(ID, Action, _),
   detectedObjState(ID, Obj, State, after),
   time(T).

terminates(Action, currentState(Obj, State), T) :-
   detectedObjState(ID, Obj, State, before),
   detectedAction(ID, Action, _),
   not detectedObjState(ID, Obj, State, after),
   time(T).