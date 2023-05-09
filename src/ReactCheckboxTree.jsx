import React from 'react';
import { useState } from "react";
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const nodes = [
  {
    value: 'loa',
    label: 'Lessons on Assurance'
  },
  {
    value: 'tms60',
    label: 'TMS60',
    children: [
        { value: 'pack-a', label: 'Pack A' },
        { value: 'pack-b', label: 'Pack B' },
        { value: 'pack-c', label: 'Pack C' },
        { value: 'pack-d', label: 'Pack D' },
        { value: 'pack-e', label: 'Pack E' }
    ]
  },
  {
    value: 'dep',
    label: 'DEP',
    children: [
      { value: 'dep1', label: 'DEP 1' },
      { value: 'dep2', label: 'DEP 2' },
      { value: 'dep3', label: 'DEP 3' },
      { value: 'dep4', label: 'DEP 4' }
    ]
  }
];

// class Widget extends React.Component {
//     state = {
//         checked: [],
//         expanded: [],
//     };
// 
//     render() {
//         return (
//             <CheckboxTree
//                 nodes={nodes}
//                 checked={this.state.checked}
//                 expanded={this.state.expanded}
//                 onCheck={checked => this.setState({ checked })}
//                 onExpand={expanded => this.setState({ expanded })}
//             />
//         );
//     }
// }

function Widget() {
  const [checked, setChecked] = useState([])
  const [expanded, setExpanded] = useState([])
  console.log(checked)
  return (
    <div className="CheckboxTree">
      <CheckboxTree
        nodes={nodes}
        checked={checked}
        expanded={expanded}
        onCheck={setChecked}
        onExpand={setExpanded}
      />
    </div>
  );
}

export default Widget