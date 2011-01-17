/*!
 * Copyright ( C ) 2010 Dylon Edwards
 *
 * This code is available under MIT License.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files ( the "Software" ), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/*global window */

/**
 * The Avl Tree implementation below was rewritten from @pgrafov's
 * implementation in Python, available from the following address:
 * @link https://github.com/pgrafov/python-avl-tree
 *
 * It has been modified to be what I've come to call a Doubly-Linked List
 * Binary Extended Search Tree ( DLL BEST ), which is essentially a binary search
 * tree that has been merged with a doubly-linked list structure; the purpose
 * is to enable the creation of a sorted doubly-linked list in O( log( N )) time
 * with the assistance of the BST insert method and to provide range querying
 * such that the base of the range can be found in O( log( N )) time ( via the BST
 * find method ) and the bounded elements can be collected in constant O( N ) time
 * by simply traversing the doubly-linked list until the supremum of the set
 * has been located.
 *
 * @depends "../tree.js"
 * @depends "node.js"
 */
(function ( window ) {


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                        Local Variable Definitions                        ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


var DllBest = window.DllBest,

NS = DllBest.Avl || ( DllBest.Avl = {} ),

Node = NS.Node;


////////////////////////////////////////////////////////////////////////////////
///                                                                          ///
///                       DllBest.Avl.Tree Constructor                       ///
///                                                                          ///
////////////////////////////////////////////////////////////////////////////////


/**
 * Constructs a new Tree which functions as a BEST tree ( or a Binary Extended
 * Search Tree ).
 *
 * @param {function ( x,y )} comparator The function to use when comparing Node instances
 * @constructor
 */
function Tree( comparator ) {
	this.__super__( Node, comparator );
}

NS.Tree = Tree.inherits( DllBest.Tree ).extend({


	////////////////////////////////////////////////////////////////////////////////
	///                                                                          ///
	///                             Instance Methods                             ///
	///                                                                          ///
	////////////////////////////////////////////////////////////////////////////////


	RRC: function ( A, B, C, F ) {
		B = A.rChild;
		C = B.rChild;

		A.rChild = B.lChild;

		if ( A.rChild ) {
			A.rChild.parent = A;
		}

		B.lChild = A;
		A.parent = B;

		if ( !F ) {
			this.root = B;
			this.root.parent = null;
		} else {
			if ( F.rChild === A ) {
				F.rChild = B;
			} else {
				F.lChild = B;
			}

			B.parent = F;
		}

		this.recomputeHeights( A );
		this.recomputeHeights( B.parent );
	},

	RLC: function ( A, B, C, F ) {
		B = A.rChild;
		C = B.lChild;
		
		B.lChild = C.rChild;

		if ( B.lChild ) {
			B.lChild.parent = B;
		}

		A.rChild = C.lChild;

		if ( A.rChild ) {
			A.rChild.parent = A;
		}

		C.rChild = B;
		B.parent = C;
		C.lChild = A;
		A.parent = C;

		if ( !F ) {
			this.root = C;
			this.root.parent = null;
		} else {
			if ( F.rChild === A ) {
				F.rChild = C;
			} else {
				F.lChild = C;
			}

			C.parent = F;
		}

		this.recomputeHeights( A );
		this.recomputeHeights( B );
	},

	LLC: function ( A, B, C, F ) {
		B = A.lChild;
		C = B.lChild;

		A.lChild = B.rChild;

		if ( A.lChild ) {
			A.lChild.parent = A;
		}

		B.rChild = A;
		A.parent = B;

		if ( !F ) {
			this.root = B;
			this.root.parent = null;
		} else {
			if ( F.rChild === A ) {
				F.rChild = B;
			} else {
				F.lChild = B;
			}

			B.parent = F;
		}

		this.recomputeHeights( A );
		this.recomputeHeights( B.parent );
	},

	LRC: function ( A, B, C, F ) {
		B = A.lChild;
		C = B.rChild;

		A.lChild = C.rChild;

		if ( A.lChild ) {
			A.lChild.parent = A;
		}

		B.rChild = C.lChild;

		if ( B.rChild ) {
			B.rChild.parent = B;
		}

		C.lChild = B;
		B.parent = C;

		C.rChild = A;
		A.parent = C;

		if ( !F ) {
			this.root = C;
			this.root.parent = null;
		} else {
			if ( F.rChild === A ) {
				F.rChild = C;
			} else {
				F.lChild = C;
			}

			C.parent = F;
		}

		this.recomputeHeights( A );
		this.recomputeHeights( B );
	},

	/**
	 * Rebalances a given Node.  To see every case in which a Node will need to be
	 * balanced, see the following resource:
	 *
	 * http://www.cse.ohio-state.edu/~sgomori/570/avlrotations.html
	 *
	 * @param {Node} candidate The Node to rebalance
	 */
	rebalance: function ( candidate ) {
		/*
		 * TODO: Refactor this like I did the C-Sharp stuff
		 */

		var A = candidate, B, C,
			balance = A.balance(),
			F = A.parent;

		if ( balance <= -2 ) {
			if ( candidate.rChild.balance() <= 0 ) {
				this.RRC( A, B, C, F );
			} else {
				this.RLC( A, B, C, F );
			}
		} else if ( balance >= 2 ) {
			if ( candidate.lChild.balance() >= 0 ) {
				this.LLC( A, B, C, F );
			} else {
				this.LRC( A, B, C, F );
			}
		}
	},

	/**
	 * Recomputes the heights of all the nodes from the current one to the root.
	 *
	 * @param {Node} node The Node at which to begin recomputing heights
	 */
	recomputeHeights: function ( node ) {
		var changed = true, oldHeight;

		while ( node && changed ) {
			oldHeight = node.height;

			node.height =
				( node.rChild || node.lChild ) ? node.maxChildHeight() + 1 : 0;

			changed = ( node.height !== oldHeight );
			node = node.parent;
		}
	},

	/**
	 * Inserts a child Node into the descendants of the given parent Node.
	 *
	 * @param {Node} parent The parent node at which to begin the insertion
	 * @param {Node} child The child node to insert
	 */
	addAsChild: function ( parent, child ) {
		var candidate = null, ineq;

		ineq = this.compare( child.key, parent.key );

		if ( ineq < 0 ) {
			candidate = this.addLeftChild( parent, child );
		} else if ( ineq > 0 ) {
			candidate = this.addRightChild( parent, child );
		} else {
			this.addEqualChild( parent, child );
		}

		if ( candidate ) {
			this.rebalance( candidate );
		}
	},

	addLeftChild: function ( parent, child ) {
		child.gt = parent;

		var candidate = null, node;

		if ( !parent.lChild ) {
			parent.lChild = child;
			child.parent = parent;

			if ( parent.lt ) {
				parent.lt.gt = child;
			}

			parent.lt = child;

			if ( parent.height === 0 ) {
				node = parent;

				while ( node ) {
					node.height = node.maxChildHeight() + 1;

					if ( !node.isBalanced()) {
						candidate = node;
						break;
					}

					node = node.parent;
				}
			}
		} else {
			this.addAsChild( parent.lChild, child );
		}

		return candidate;
	},

	addRightChild: function ( parent, child ) {
		child.lt = parent;

		var candidate = null, node;

		if ( !parent.rChild ) {
			parent.rChild = child;
			child.parent = parent;

			if ( parent.gt ) {
				parent.gt.lt = child;
			}

			parent.gt = child;

			if ( parent.height === 0 ) {
				node = parent;

				while ( node ) {
					node.height = node.maxChildHeight() + 1;
					
					if ( !node.isBalanced()) {
						candidate = node;
						break;
					}

					node = node.parent;
				}
			}
		} else {
			this.addAsChild( parent.rChild, child );
		}

		return candidate;
	},

	addEqualChild: function ( parent, child ) {
		child.eq = parent.eq;
		parent.eq = child;

		// Only the topmost node should maintain the DLL
		child.lt = null;
		child.gt = null;
	},

	/**
	 * Removes a particular Node from this Tree
	 *
	 * @param {Node} node The Node to remove
	 */
	removeNode: function ( node ) {
		this.elements -= 1;
		
		/*
		 * Remove the node from the doubly-linked list
		 */

		if ( node.eq ) {
			node.eq.assign( node );
			return; ///<-- NOTE: Return here
		}

		if ( node.lt ) {
			node.lt.gt = node.gt;
		}

		if ( node.gt ) {
			node.gt.lt = node.lt;
		}

		/*
		 * There are three cases:
		 *
		 * 1 ) The node is a leaf.  Remove it and return.
		 *
		 * 2 ) The node is a branch ( has only 1 child ).  Make the pointer to this
		 * node point to the child of this node.
		 *
		 * 3 ) The node has two children.  Swap items with the successor of the
		 * node ( the smallest item in its right subtree ) and delete the successor
		 * from the right subtree of the node.
		 */

		if ( node.isLeaf()) {
			this.removeLeaf( node );
		} else if ( node.isBranch()) {
			this.removeBranch( node );
		} else {
			this.swapAndRemove( node );
		}
	},

	/**
	 * Instructions for removing a leaf node from this Tree
	 *
	 * @param {Node} node The leaf node to remove
	 */
	removeLeaf: function ( node ) {
		var parent = node.parent;

		if ( parent ) {
			if ( parent.lChild === node ) {
				parent.lChild = null;
			} else {
				parent.rChild = null;
			}

			this.recomputeHeights( parent );
		} else {
			this.root = null;
			return; ///<-- NOTE: Return here
		}

		node = parent;

		do {
			if ( !node.isBalanced()) {
				this.rebalance( node );
			}
		} while (( node = node.parent ));
	},

	/**
	 * Instructions for removing a node which has children on one side only from this Tree.
	 *
	 * @param {Node} node The node to remove
	 */
	removeBranch: function ( node ) {
		var parent = node.parent;

		if ( !parent ) {
			return; ///<-- NOTE: Return here
		}

		if ( parent.lChild ) {
			parent.lChild = ( node.rChild || node.lChild );
		} else {
			parent.rChild = ( node.rChild || node.lChild );
		}

		if ( node.lChild ) {
			node.lChild.parent = parent;
		} else {
			node.rChild.parent = parent;
		}

		this.recomputeHeights( parent );
		node = parent;

		do {
			if ( !node.isBalanced()) {
				this.rebalance( node );
			}
		} while (( node = node.parent ));
	},

	/**
	 * Instructions for removing a node which has children on both sides from this Tree
	 *
	 * @param {Node} node The Node to remove
	 */
	swapAndRemove: function ( node ) {
		var successor = this.findSmallest( node.rChild );
		this.swapNodes( node, successor );

		if ( node.height === 0 ) {
			this.removeLeaf( node );
		} else {
			this.removeBranch( node );
		}
	},

	/**
	 * Swaps the values of two nodes in this Tree
	 *
	 * @param {Node} node1 The Node to swap with node2
	 * @param {Node} node2 The Node to swap with node1
	 */
	swapNodes: function ( node1, node2 ) {
		/*
		 * TODO: Compare this with the C# version
		 */

		var parent1 = node1.parent,
			lChild1 = node1.lChild,
			rChild1 = node1.rChild,

			parent2 = node2.parent,
			lChild2 = node2.lChild,
			rChild2 = node2.rChild,
			
			tmp;
		
		tmp = node1.height;
		node1.height = node2.height;
		node2.height = tmp;

		if ( parent1 ) {
			if ( parent1.lChild === node1 ) {
				parent1.lChild = node2;
			} else {
				parent1.rChild = node2;
			}

			node2.parent = parent1;
		} else {
			this.root = node2;
			node2.parent = null;
		}

		node2.lChild = lChild1;
		lChild1.parent = node2;

		node1.lChild = lChild2;
		node1.rChild = rChild2;

		if ( rChild2 ) {
			rChild2.parent = node1;
		} else if ( parent2 !== node1 ) {
			node2.rChild = rChild1;
			rChild1.parent = node2;

			parent2.lChild = node1;
			node1.parent = parent2;
		} else {
			node2.rChild = node1;
			node1.parent = node2;
		}
	}
});

}( window ));

