@Vision
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Add all axioms from training in "visionInput.lp", following the format given, e.g.:
%% Input format from Vision
%% detectedObjState(<videoID>, <objLabel>, <stateLabel>, <"before"/"after">).
%% detectedAction(<videoID>, <actionLabel>, <objLabel> [optional]).
%% Example:
detectedObjState(1,knife, placedOnTable, before).
detectedAction(1, pickUp, knife).
detectedObjState(1,knife, carring, after).

% Note 1: actions are written in present perfect, states in past perfect or in gerund (-ing).
% Note 2: Only specify what is being detected during training, not what is not being detected
% Note 3: Add only what has been learned, i.e., after processing the dataset, filtering out data with low confidence etc
% Note 4: Use the object category (class label), e.g., knife, DO NOT use the object id, e.g., knife1.
% Note 4: No empty spaces, no underscore, between words, e.g., "pickingUp", instead of "picking Up"

This happens only once, at training time, not at run-time




%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Scenario A
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

@Controler
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Modify file "observations.lp" with object states and actions, e.g.,

holdsAt(currentState(knife, placedOnTable), 0).

happens(pickUp,1).


@UI
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Add in "reasonerInit.txt" the command

./clingo5_4
./observations.lp
./visionInput.lp
./domainAxiomsVision.lp
./DEC.lp
-c maxstep=2
0

Run "reasonser.jar"

Show the content of "reasonerOutput.txt" on the "Reasoner" window



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Scenario B
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


@Controler
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Modify file "planner_initial.lp" with object states, e.g.,

holdsAt(currentState(knife, placedOnTable), 0).


Then, modify file "planner_goal.lp" with object states, e.g.,

goalAchieved(t) :- 
	holdsAt(currentState(knife,carring2),t).



@UI
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Add in "reasonerInit.txt" the command

./clingo5_4
./planner.lp
0

Run "reasoner.jar"

Show the content of "reasonerOutput.txt" on the "Reasoner" window