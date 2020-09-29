% DEC.lp
% Discrete Event Calculus Domain independent axiomatization

%time(0..maxstep).
time(0..2).


initiated2(F,T) :- 
   happens(E,T), initiates(E,F,T), time(T), fluent(F), event(E).

terminated2(F,T) :- 
   happens(E,T), terminates(E,F,T), time(T), fluent(F), event(E).

released2(F,T) :- 
   happens(E,T), releases(E,F,T), time(T), fluent(F), event(E).

% DEC 5
holdsAt(F,T+1) :- 
   holdsAt(F,T), 
   not releasedAt(F,T+1), 
   not terminated2(F,T),
   T<maxstep, time(T), fluent(F).

% DEC 6
:- not holdsAt(F,T), 
   not releasedAt(F,T+1), 
   not initiated2(F,T),
   holdsAt(F,T+1), T<maxstep, time(T), fluent(F).

% DEC 7
releasedAt(F,T+1) :- 
   releasedAt(F,T), not initiated2(F,T), not terminated2(F,T),
   T<maxstep, time(T), fluent(F).

% DEC 8
:- not releasedAt(F,T), not released2(F,T),
   releasedAt(F,T+1), T<maxstep, time(T), fluent(F).



% DEC 9
holdsAt(F,T+1) :- 
   happens(E,T), initiates(E,F,T), time(T), fluent(F), event(E), T<maxstep, time(T), fluent(F), event(E).
   
% DEC 10
:- happens(E,T), terminates(E,F,T), holdsAt(F,T+1), T<maxstep, time(T), fluent(F), event(E).

% DEC 11
releasedAt(F,T+1) :- 
   happens(E,T), releases(E,F,T), T<maxstep, time(T), fluent(F), event(E).

% DEC 12
:- happens(E,T), initiates(E,F,T), releasedAt(F,T+1), T<maxstep, time(T), fluent(F), event(E).

:- happens(E,T), terminates(E,F,T), releasedAt(F,T+1), T<maxstep, time(T), fluent(F), event(E).


% If you wish to utilise the reseasedAt predicate, you need to uncomment the next two rules and comment out the third. In that case, you have to explicitly declare what holds and what does not hold at timepjoint 0!
%{holdsAt(F,T)}:- fluent(F), time(T).
%{releasedAt(F,T)}:- fluent(F), time(T).
% No fluent is released
:- {not releasedAt(F,0)}0, fluent(F).

