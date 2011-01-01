/// Copyright (C) 2010 Dylon Edwards
///
/// This code is available under MIT License.
/// 
/// Permission is hereby granted, free of charge, to any person obtaining a copy
/// of this software and associated documentation files (the "Software"), to deal
/// in the Software without restriction, including without limitation the rights
/// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/// copies of the Software, and to permit persons to whom the Software is
/// furnished to do so, subject to the following conditions:
/// 
/// The above copyright notice and this permission notice shall be included in
/// all copies or substantial portions of the Software.
/// 
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.

using System;

namespace DllBest {
	namespace Avl {

		/// The Avl Tree implementation below was rewritten from @pgrafov's
		/// implementation in Python, available from the following address:
		/// <see cref="https://github.com/pgrafov/python-avl-tree" />
		///
		/// It has been modified to be what I've come to call a Doubly-Linked List
		/// Binary Extended Search Tree (DLL BEST), which is essentially a binary search
		/// tree that has been merged with a doubly-linked list structure; the purpose
		/// is to enable the creation of a sorted doubly-linked list in O(log(N)) time
		/// with the assistance of the BST insert method and to provide range querying
		/// such that the base of the range can be found in O(log(N)) time (via the BST
		/// find method) and the bounded elements can be collected in constant O(N) time
		/// by simply traversing the doubly-linked list until the supremum of the set
		/// has been located.
		public class Tree<T> : DllBest.Tree<T,Node<T>> {


			////////////////////////////////////////////////////////////////////////
			///                                                                  ///
			///                   DllBest.Avl.Tree Constructor                   ///
			///                                                                  ///
			////////////////////////////////////////////////////////////////////////


			/// <summary>
			/// Constructs a new Tree which functions as a BEST tree (or a Binary
			/// Extended Search Tree) </summary>
			///
			/// <param name="Compare">
			/// The DllBest.Tree.Comparator for use with this Tree </param>
			public Tree(Comparator Compare)
				: base(Compare)
			{ }


			////////////////////////////////////////////////////////////////////////
			///                                                                  ///
			///                         Instance Methods                         ///
			///                                                                  ///
			////////////////////////////////////////////////////////////////////////


			public void RRC(ref Node<T> A, out Node<T> B, out Node<T> C, ref Node<T> F) {
				B = A.RChild;
				C = B.RChild;

				A.RChild = B.LChild;

				if (A.RChild != null) {
					A.RChild.Parent = A;
				}

				B.LChild = A;
				A.Parent = B;

				if (F == null) {
					this.Root = B;
					this.Root.Parent = null;
				}
				else {
					if (F.RChild == A) {
						F.RChild = B;
					}
					else {
						F.LChild = B;
					}

					B.Parent = F;
				}

				this.RecomputeHeights(A);
				this.RecomputeHeights(B.Parent);
			}

			public void RLC(ref Node<T> A, out Node<T> B, out Node<T> C, ref Node<T> F) {
				B = A.RChild;
				C = B.LChild;

				B.LChild = C.RChild;

				if (B.LChild != null) {
					B.LChild.Parent = B;
				}

				A.RChild = C.LChild;

				if (A.RChild != null) {
					A.RChild.Parent = A;
				}

				C.RChild = B;
				B.Parent = C;

				C.LChild = A;
				A.Parent = C;

				if (F == null) {
					this.Root = C;
					this.Root.Parent = null;
				}
				else {
					if (F.RChild == A) {
						F.RChild = C;
					}
					else {
						F.LChild = C;
					}

					C.Parent = F;
				}

				this.RecomputeHeights(A);
				this.RecomputeHeights(B);
			}

			public void LLC(ref Node<T> A, out Node<T> B, out Node<T> C, ref Node<T> F) {
				B = A.LChild;
				C = B.LChild;

				A.LChild = B.RChild;

				if (A.LChild != null) {
					A.LChild.Parent = A;
				}

				B.RChild = A;
				A.Parent = B;

				if (F == null) {
					this.Root = B;
					this.Root.Parent = null;
				}
				else {
					if (F.RChild == A) {
						F.RChild = B;
					}
					else {
						F.LChild = B;
					}

					B.Parent = F;
				}

				this.RecomputeHeights(A);
				this.RecomputeHeights(B.Parent);
			}

			public void LRC(ref Node<T> A, out Node<T> B, out Node<T> C, ref Node<T> F) {
				B = A.LChild;
				C = B.RChild;

				A.LChild = C.RChild;

				if (A.LChild != null) {
					A.LChild.Parent = A;
				}

				B.RChild = C.LChild;

				if (B.RChild != null) {
					B.RChild.Parent = B;
				}

				C.LChild = B;
				B.Parent = C;

				C.RChild = A;
				A.Parent = C;

				if (F == null) {
					this.Root = C;
					this.Root.Parent = null;
				}
				else {
					if (F.RChild == A) {
						F.RChild = C;
					}
					else {
						F.LChild = C;
					}

					C.Parent = F;
				}

				this.RecomputeHeights(A);
				this.RecomputeHeights(B);
			}

			/// <summary>
			/// Rebalances a given Node.  To see every case in which a Node will
			/// need to be balanced, see:
			///
			/// <see cref="http://www.cse.ohio-state.edu/~sgomori/570/avlrotations.html" />
			/// </summary>
			///
			/// <param name="node">
			/// Node to rebalance </param>
			public void Rebalance(Node<T> node) {
				Node<T> A = node, F = A.Parent, B, C;
				int balance = A.Balance;

				if (balance <= -2) {
					if (node.RChild.Balance <= 0) {
						this.RRC(ref A, out B, out C, ref F);
					}
					else {
						this.RLC(ref A, out B, out C, ref F);
					}
				}
				else if (balance >= 2) {
					if (node.LChild.Balance >= 0) {
						this.LLC(ref A, out B, out C, ref F);
					}
					else {
						this.LRC(ref A, out B, out C, ref F);
					}
				}
			}

			/// <summary>
			/// Recomputes the heights of all the nodes from the current one to the
			/// root </summary>
			///
			/// <param name="node">
			/// The Node whose height is to be recomputed </param>
			public void RecomputeHeights(Node<T> node) {
				bool changed = true;

				while ((node != null) && changed) {
					int height1 = node.Height;

					int height2 = node.Height =
						((node.RChild != null) || (node.LChild != null))
							? node.MaxChildHeight + 1 : 0;

					changed = (height1 != height2);
					node = node.Parent;
				}
			}

			public void AddLeftChild(Node<T> parent, Node<T> child, ref Node<T> candidate) {
				child.Gt = parent;

				if (parent.LChild == null) {
					parent.LChild = child;
					child.Parent = parent;

					if (parent.Lt != null) {
						parent.Lt.Gt = child;
					}

					parent.Lt = child;

					if (parent.Height == 0) {
						Node<T> node = parent;

						while (node != null) {
							node.Height = node.MaxChildHeight + 1;

							if (!node.IsBalanced) {
								candidate = node;
								break;
							}

							node = node.Parent;
						}
					}
				}
				else {
					this.AddAsChild(parent.LChild, child);
				}
			}
			
			public void AddRightChild(Node<T> parent, Node<T> child, ref Node<T> candidate) {
				child.Lt = parent;

				if (parent.RChild == null) {
					parent.RChild = child;
					child.Parent = parent;

					if (parent.Gt != null) {
						parent.Gt.Lt = child;
					}

					parent.Gt = child;

					if (parent.Height == 0) {
						Node<T> node = parent;

						while (node != null) {
							node.Height = node.MaxChildHeight + 1;

							if (!node.IsBalanced) {
								candidate = node;
								break;
							}

							node = node.Parent;
						}
					}
				}
				else {
					this.AddAsChild(parent.RChild, child);
				}
			}

			public void AddEqualChild(Node<T> parent, Node<T> child) {
				child.Eq = parent.Eq;
				parent.Eq = child;

				// Only the topmost node should maintain the DLL
				child.Lt = null;
				child.Gt = null;
			}

			public override void AddAsChild(Node<T> parent, Node<T> child) {
				Node<T> candidate = null;

				int ineq = this.Compare(child.Key, parent.Key);

				if (ineq < 0) {
					this.AddLeftChild(parent, child, ref candidate);
				}
				else if (ineq > 0) {
					this.AddRightChild(parent, child, ref candidate);
				}
				else {
					this.AddEqualChild(parent, child);
				}

				if (candidate != null) {
					this.Rebalance(candidate);
				}
			}

			/// <summary>
			/// Removes a particular Node from this Tree </summary>
			///
			/// <param name="node">
			/// The node to remove </param>
			public override void RemoveNode(Node<T> node) {
				this.Elements -= 1;
				
				/*
				 * Remove the node from the doubly-linked list
				 */

				if (node.Eq != null) {
					node.Eq.Assign(node);
					return; //<-- NOTE: Return here
				}

				if (node.Lt != null) {
					node.Lt.Gt = node.Gt;
				}

				if (node.Gt != null) {
					node.Gt.Lt = node.Lt;
				}

				/*
				 * There are three cases:
				 *
				 * 1) The node is a leaf.  Remove it and return.
				 *
				 * 2) The node is a branch (has only 1 child).  Make the pointer to
				 * this node point to the child of this node.
				 *
				 * 3) The node has two children.  Swap items with the successor of
				 * the node (the smallest item in its right subtree) and delete the
				 * successor from the right subtree of the node.
				 */

				if (node.IsLeaf) {
					this.RemoveLeaf(node);
				}
				else if (node.IsBranch) {
					this.RemoveBranch(node);
				}
				else {
					this.SwapAndRemove(node);
				}
			}

			/// <summary>
			/// Removes a leaf Node from this Tree </summary>
			///
			/// <param name="node">
			/// The Node to remove </param>
			public void RemoveLeaf(Node<T> node) {
				Node<T> parent = node.Parent;

				if (parent != null) {
					if (parent.LChild == node) {
						parent.LChild = null;
					}
					else {
						parent.RChild = null;
					}

					this.RecomputeHeights(parent);
				}
				else {
					this.Root = null;
				}

				node = parent;
				while (node != null) {
					if (!node.IsBalanced) {
						this.Rebalance(node);
					}

					node = node.Parent;
				}
			}

			/// <summary>
			/// Removes a branch Node from this Tree </summary>
			///
			/// <param name="node">
			/// The Node to remove </param>
			public void RemoveBranch(Node<T> node) {
				Node<T> parent = node.Parent;

				if (parent != null) {
					if (parent.LChild != null) {
						parent.LChild = (node.RChild ?? node.LChild);
					}
					else {
						parent.RChild = (node.RChild ?? node.LChild);
					}

					if (node.LChild != null) {
						node.LChild.Parent = parent;
					}
					else {
						node.RChild.Parent = parent;
					}

					this.RecomputeHeights(parent);
				}

				node = parent;
				while (node != null) {
					if (!node.IsBalanced) {
						this.Rebalance(node);
					}

					node = node.Parent;
				}
			}

			/// <summary>
			/// Removes a Node from this Tree that has two children </summary>
			///
			/// <param name="node">
			/// The Node to remove </param>
			public void SwapAndRemove(Node<T> node) {
				Node<T> successor = this.FindSmallest(node.RChild);
				this.SwapNodes(node, successor);

				if (node.Height == 0) {
					this.RemoveLeaf(node);
				}
				else {
					this.RemoveBranch(node);
				}
			}

			/// <summary>
			/// Swaps the values of two Nodes in this Tree </summary>
			///
			/// <param name="node1">
			/// Node to swap with node2 </param>
			///
			/// <param name="node2">
			/// Node to swap with node1 </param>
			public void SwapNodes(Node<T> node1, Node<T> node2) {
				Node<T> parent1 = node1.Parent,
						lchild1 = node1.LChild,
						rchild1 = node1.RChild,

						parent2 = node2.Parent,
						lchild2 = node2.LChild,
						rchild2 = node2.RChild;

				int tmp = node1.Height;
				node1.Height = node2.Height;
				node2.Height = tmp;

				if (parent1 != null) {
					if (parent1.LChild == node1) {
						parent1.LChild = node2;
					}
					else {
						parent1.RChild = node2;
					}

					node2.Parent = parent1;
				}
				else {
					this.Root = node2;
					node2.Parent = null;
				}

				node2.LChild = lchild1;
				lchild1.Parent = node2;

				node1.LChild = lchild2;
				node1.RChild = rchild2;

				if (rchild2 != null) {
					rchild2.Parent = node1;
				}
				else if (parent2 != node1) {
					node2.RChild = rchild1;
					rchild1.Parent = node2;

					parent2.LChild = node1;
					node1.Parent = parent2;
				}
				else {
					node2.RChild = node1;
					node1.Parent = node2;
				}
			}
		}
	}
}

