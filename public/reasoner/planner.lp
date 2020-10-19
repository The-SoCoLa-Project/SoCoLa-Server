#include <incmode>.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#program base.
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


% Domain Definition
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

#include "visionInput.lp".
%detectedObjState(1,knife, placedOnTable, before).
%detectedAction(1, pickUp, knife).
%detectedObjState(1,knife, carring, after).



%%%% Fluent Definitions
fluent(currentState(Obj, State)) :-
   detectedObjState(_, Obj, State, _).



%%%% Event Definitions
event(Action) :-
   detectedAction(_, Action, Obj).




% Initial State Axiomatization
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

#include "planner_initial.lp".

observed(Obj) :-
   holdsAt(currentState(Obj, _), 0).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#program step(t).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%




initiates(Action, currentState(Obj, State), t) :-
   detectedAction(ID, Action, Obj),
   detectedObjState(ID, Obj, State, after),
   observed(Obj).

terminates(Action, currentState(Obj, State), t) :-
   detectedObjState(ID, Obj, State, before),
   detectedAction(ID, Action, Obj),
   observed(Obj),
   not detectedObjState(ID, Obj, State, after).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% DEC Domain-Independent Axiomatization
% Do not change this part
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

0{doHappens(E,t):event(E)}1.
happens(E,t) :- doHappens(E,t).

initiated2(F,t) :- 
   happens(E,t), initiates(E,F,t), fluent(F), event(E).

terminated2(F,t) :- 
   happens(E,t), terminates(E,F,t), fluent(F), event(E).

% DEC 5
holdsAt(F,t) :- 
   holdsAt(F,t-1), 
   not terminated2(F,t-1), 
   fluent(F).
   
holdsAt(F,t) :- 
   happens(E,t-1), initiates(E,F,t-1), fluent(F), event(E).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#program check(t).
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
	
% Definition of Goal State
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%goalAchieved(t) :- holdsAt(currentState(knife,carring),t).
#include "planner_goal.lp".


%:- query(t), not goalAchieved(t).


% Do not change this part
% No action should happen at the last timepoint nor should you hold an object
%:- query(t), happens(E,t), event(E).

% Stop planning after 4 steps
%a :- holdsAt(_,4).
%-a :- holdsAt(_,4).




%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
#show holdsAt/2.
%#show happens/2.
#show doHappens/2.





