import {fromJS} from 'immutable';

const defaultState = fromJS({
    username:'admin'
});

export default (state = defaultState , action)=>{
    return state;
}