%% Input format from Vision
%% detectedObjState(<videoID>, <objLabel>, <stateLabel>, <"before"/"after">).
%% detectedAction(<videoID>, <actionLabel>, <objLabel> [optional]).


detectedObjState(1,knife, placedOnTable, before).
detectedAction(1, pickUp, knife).
detectedObjState(1,knife, carring, after).

% Note 1: actions are written in present perfect, states in past perfect or in gerund (-ing).
% Note 2: Only specify what is being detected during training, not what is not being detected
% Note 3: Add only what has been learned, i.e., after processing the dataset, filtering out data with low confidence etc
% Note 4: Use the object category (class label), e.g., knife, DO NOT use the object id, e.g., knife1.
% Note 4: No empty spaces, no underscore, between words, e.g., "pickingUp", instead of "picking Up"



