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
using System.Collections.Generic;

namespace DllBest {

	/// <summary>
	/// Provides a base Tree class for all Doubly-Linked List, Binary Extended
	/// Search Tree classes. </summary>
	///
	///
	public abstract class Tree<T,N> where N : Node<T,N>, new() {


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                            Delegates                             ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Compares two elements x and y.  The return value should be less
		/// than zero of x is less than y, equal to zero if x is equal to y,
		/// or greater than zero if x is greater than y </summary>
		///
		/// <param name="x">
		/// The first element of type T to compare </param>
		///
		/// <param name="y">
		/// The second element of type T to comapre </param>
		public delegate int Comparator(T x, T y);

		/// <summary>
		/// Compares two T elements </summary>
		public Comparator Compare;


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                            Properties                            ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Height of this Binary Search Tree </summary>
		public int Height {
			get {
				if (this.Root != null) {
					return this.Root.Height;
				}

				return 0;
			}
		}

		/// <summary>
		/// Biggest value in this Tree </summary>
		public N Biggest {
			get {
				if (this.Root != null) {
					return this.FindBiggest(this.Root);
				}

				return null;
			}
		}

		/// <summary>
		/// Smallest value in this Tree </summary>
		public N Smallest {
			get {
				if (this.Root != null) {
					return this.FindSmallest(this.Root);
				}

				return null;
			}
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                          Default Fields                          ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Root Node of this Tree </summary>
		public N Root { get; set; }

		/// <summary>
		/// Number of elements in this Tree </summary>
		public int Elements = 0;


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                     DllBest.Tree Constructor                     ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Constructs a new DllBest.Tree </summary>
		///
		/// <param name="Compare">
		/// Delegate for comparing two T elements </param>
		public Tree(Comparator Compare) {
			this.Compare = Compare;
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                         Instance Methods                         ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Creates and inserts a new Node using the provided key as its value
		/// </summary>
		///
		/// <param name="key">
		/// Value to provide the new Node </param>
		///
		/// <returns>
		/// Whether the insert was successful </returns>
		public bool TryInsert(T key) {
			N node;

			if (this.Root == null) {
				node = new N();
				node.Key = key;
				this.Root = node;

				return true;
			}

			if (this.Find(key) == null) {
				node = new N();
				node.Key = key;

				this.AddAsChild(this.Root, node);
				this.Elements += 1;

				return true;
			}

			return false;
		}

		/// <summary>
		/// Creates and appends a new Node using the provided key as its value.
		/// The difference between this.Append and this.TryInsert is that
		/// this.TryInsert only adds a new node if there is not one with an
		/// equivalent value already in this Tree. </summary>
		///
		/// <param name="key">
		/// Value of the Node to insert </param>
		public void Append(T key) {
			N node = new N();
			node.Key = key;

			if (this.Root != null) {
				this.AddAsChild(this.Root, node);
				this.Elements += 1;
			}
			else {
				this.Root = node;
			}
		}

		/// <summary>
		/// Locates and returns the biggest Node from the given one </summary>
		///
		/// <param name="node">
		/// Root Node of the sub-tree to traverse </param>
		///
		/// <returns>
		/// The biggest Node branching from node </returns>
		public N FindBiggest(N node) {
			while (node.RChild != null) {
				node = (N) node.RChild;
			}

			return node;
		}

		/// <summary>
		/// Locates and returns the smalles Node from the given one </summary>
		///
		/// <param name="node">
		/// Root Node of the sub-tree to traverse </param>
		///
		/// <returns>
		/// The smallest Node branching from node </returns>
		public N FindSmallest(N node) {
			while (node.LChild != null) {
				node = (N) node.LChild;
			}

			return node;
		}

		/// <summary>
		/// Recursively traverses this Tree in pre-order </summary>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <param name="list">
		/// The list containing all of the values </param>
		///
		/// <returns>
		/// The values of this Tree in pre-order </returns>
		public List<T> PreOrder(N node, ref List<T> list) {
			list.Add(node.Key);

			N next = node;
			while ((next = (N) next.Eq) != null) {
				list.Add(next.Key);
			}

			if (node.LChild != null) {
				this.PreOrder((N) node.LChild, ref list);
			}

			if (node.RChild != null) {
				this.PreOrder((N) node.RChild, ref list);
			}

			return list;
		}

		/// <summary>
		/// Recursively traverses this Tree in pre-order </summary>
		///
		/// <returns>
		/// The values of this Tree in pre-order </returns>
		public List<T> PreOrder() {
			List<T> list = new List<T>(this.Elements);

			if (this.Root != null) {
				return this.PreOrder(this.Root, ref list);
			}

			return list;
		}

		/// <summary>
		/// Recursively traverses this Tree in order </summary>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <param name="list">
		/// The list containing all of the values </param>
		///
		/// <returns>
		/// The values of this Tree in order </returns>
		public List<T> InOrder(N node, ref List<T> list) {
			if (node.LChild != null) {
				this.InOrder((N) node.LChild, ref list);
			}

			list.Add(node.Key);

			N next = node;
			while ((next = (N) next.Eq) != null) {
				list.Add(next.Key);
			}

			if (node.RChild != null) {
				this.InOrder((N) node.RChild, ref list);
			}

			return list;
		}

		/// <summary>
		/// Recursively traverses this Tree in order </summary>
		///
		/// <returns>
		/// The values of this Tree in order </returns>
		public List<T> InOrder() {
			List<T> list = new List<T>(this.Elements);

			if (this.Root != null) {
				return this.InOrder(this.Root, ref list);
			}

			return list;
		}

		/// <summary>
		/// Recursively traverses this Tree in post-order </summary>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <param name="list">
		/// The list containing all of the values </param>
		///
		/// <returns>
		/// The values of this Tree in post-order </returns>
		public List<T> PostOrder(N node, ref List<T> list) {
			if (node.LChild != null) {
				this.PostOrder((N) node.LChild, ref list);
			}

			if (node.RChild != null) {
				this.PostOrder((N) node.RChild, ref list);
			}

			list.Add(node.Key);

			N next = node;
			while ((next = (N) next.Eq) != null) {
				list.Add(next.Key);
			}

			return list;
		}

		/// <summary>
		/// Recursively traverses this Tree in post-order </summary>
		///
		/// <returns>
		/// The values of this Tree in post-order </returns>
		public List<T> PostOrder() {
			List<T> list = new List<T>(this.Elements);

			if (this.Root != null) {
				return this.PostOrder(this.Root, ref list);
			}

			return list;
		}

		/// <summary>
		/// Recursively locates the Node in this Tree with the requested key
		/// </summary>
		///
		/// <param name="node">
		/// Node at which to begin the traversal </param>
		///
		/// <param name="key">
		/// Value of the sought after Node </param>
		///
		/// <returns>
		/// Either a matching Node or null if none can be found </returns>
		public N FindInSubTree(N node, T key) {
			if (node == null) {
				return null;
			}

			int ineq = this.Compare(key, node.Key);

			if (ineq < 0) {
				return this.FindInSubTree((N) node.LChild, key);
			}

			if (ineq > 0) {
				return this.FindInSubTree((N) node.RChild, key);
			}

			return node;
		}

		/// <summary>
		/// Locates the Node in this Tree with the requested key </summary>
		///
		/// <returns>
		/// Either a matching Node or null if none can be found </returns>
		public N Find(T key) {
			return this.FindInSubTree(this.Root, key);
		}

		/// <summary>
		/// Removes the Node corresponding to the given key </summary>
		///
		/// <param name="key">
		/// Value of the Node to remove </param>
		///
		/// <returns>
		/// Whether the operation was successful </returns>
		public bool Remove(T key) {
			N node = this.Find(key);

			if (node != null) {
				this.RemoveNode(node);
				return true;
			}

			return false;
		}

		/// <summary>
		/// Returns the range of nodes from this Tree whose values are bounded
		/// by lower and upper </summary>
		///
		/// <param name="lower">
		/// Lower bound of the elements to return </param>
		///
		/// <param name="upper">
		/// Upper bound of the elements to return </param>
		///
		/// <returns>
		/// A list of the bounded elements in this Tree </returns>
		public List<T> GetRange(T lower, T upper) {
			List<T> range = new List<T>();
			
			N curr = this.Root;

			while (curr != null) {
				int comp = this.Compare(curr.Key, lower);

				if (comp < 0) {
					curr = (N) curr.RChild;
				}
				else if ((comp > 0) && (curr.LChild != null)) {
					curr = (N) curr.LChild;
				}
				else {
					break;
				}
			}

			while ((curr != null) && (this.Compare(curr.Key, upper) <= 0)) {
				range.Add(curr.Key);

				N node = curr;
				while ((node = (N) node.Eq) != null) {
					range.Add(node.Key);
				}

				curr = (N) curr.Gt;
			}

			return range;
		}

		/// <summary>
		/// Returns an inorder traversal of this Tree according to the
		/// doubly-linked list, rather than the binary search tree.  This is a
		/// faster method than the traditional BST inorder traversal, and is
		/// useful for debugging. </summary>
		///
		/// <returns>
		/// An inorder list of all the elements in this Tree </returns>
		public List<T> DllDump() {
			List<T> dump = new List<T>(this.Elements);

			N curr = this.Smallest;
			while (curr != null) {
				dump.Add(curr.Key);

				N node = curr;
				while ((node = (N) node.Eq) != null) {
					dump.Add(node.Key);
				}

				curr = (N) curr.Gt;
			}

			return dump;
		}

		/// <summary>
		/// Allows this Tree to function as a priority queue by removing and
		/// returning the value of the greatest node. </summary>
		///
		/// <returns>
		/// The value of the greatest Node in this Tree </returns>
		public T Dequeue() {
			N node = this.Biggest;

			if (node != null) {
				this.RemoveNode(node);
				return node.Key;
			}

			return default(T);
		}

		
		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                         Abstract Methods                         ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		public abstract void AddAsChild(N root, N node);

		public abstract void RemoveNode(N node);
	}
}

