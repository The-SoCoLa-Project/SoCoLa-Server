%% Input format from Vision
%% detectedObjState(<videoID>, <objLabel>, <stateLabel>, <"before"/"after">).
%% detectedAction(<videoID>, <actionLabel>, <objLabel> [optional]).


%detectedObjState(1,knife, onTable, before).
%detectedAction(1, pickingUp, knife).
%detectedObjState(1,knife, carries, after).



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

  #show holdsAt/2.
  #show happens/2.