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
using CG = System.Collections.Generic;

namespace DllBest {

	[Flags]
	public enum Redundancy {
		Redundant = 0x01 << 0,
		Unique    = 0x01 << 1,
	}

	/// <summary>
	/// Provides a base Tree class for all Doubly-Linked CG.List, Binary Extended
	/// Search Tree classes. </summary>
	public abstract partial class Tree<T,N> : IRedundant<T,N>, IUnique<T,N>
		where N : Node<T,N>, new() {


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                            Delegates                             ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		/// <summary>
		/// Compares two elements of type T </summary>
		public Comparator Compare;

		protected Indexer m_get;

		protected Order m_preorder;

		protected Order m_inorder;

		protected Order m_postorder;

		protected Ranger m_range;

		protected Inserter m_insert;


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                          Default Fields                          ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                              Flags                               ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////
		
		
		public Redundancy Redundancy;


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
		public Tree(Comparator Compare, Redundancy Redundancy) {
			this.Compare = Compare;
			this.Redundancy = Redundancy;

			switch (Redundancy) {
				case Redundancy.Redundant: {
					Init<IRedundant<T,N>>();
					break;
				}
				case Redundancy.Unique: {
					Init<IUnique<T,N>>();
					break;
				}
			}
		}

		public Tree(Comparator Compare)
			: this(Compare, Redundancy.Redundant) {
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                           Init Method                            ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		protected void Init<I>() where I : ITree<T,N,I> {
			m_get       = ((ITree<T,N,I>) this).Get;
			m_preorder  = ((ITree<T,N,I>) this).PreOrder;
			m_inorder   = ((ITree<T,N,I>) this).InOrder;
			m_postorder = ((ITree<T,N,I>) this).PostOrder;
			m_range     = ((ITree<T,N,I>) this).Range;
			m_insert    = ((ITree<T,N,I>) this).Insert;
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                            Properties                            ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		public N Root { 
			get; 
			set; 
		}

		public N Head { 
			get; 
			set; 
		}

		public N Tail { 
			get; 
			set; 
		}

		public int Elements {
			get;
			set;
		}

		public int Height {
			get {
				if (Root != null) {
					return Root.Height;
				}

				return 0;
			}
		}

		public N Biggest {
			get {
				if (Root != null) {
					return FindBiggest(Root);
				}

				return null;

				//return Head;
			}
		}

		public N Smallest {
			get {
				if (Root != null) {
					return FindSmallest(Root);
				}

				return null;

				//return Tail;
			}
		}


		////////////////////////////////////////////////////////////////////////
		///                                                                  ///
		///                         Instance Methods                         ///
		///                                                                  ///
		////////////////////////////////////////////////////////////////////////


		public T Get(int index, N node) {
			return m_get(index, node);
		}

		public T Get(int index) {
			return Get(index, Root);
		}

		public N FindBiggest(N node) {
			N child = node;
			while ((child = child.RChild) != null) {
				node = child;
			}

			return node;
		}

		public N FindSmallest(N node) {
			N child = node;
			while ((child = child.LChild) != null) {
				node = child;
			}

			return node;
		}

		public abstract void Add(N parent, N child);

		public abstract void Remove(N node);

		public void Insert(T value) {
			m_insert(value);
		}

		public void PreOrder(N node, CG.List<T> list) {
			m_preorder(node, list);
		}

		public CG.List<T> PreOrder() {
			CG.List<T> list = new CG.List<T>(Elements);

			if (Root != null) {
				PreOrder(Root, list);
			}

			return list;
		}

		public void InOrder(N node, CG.List<T> list) {
			m_inorder(node, list);
		}

		public CG.List<T> InOrder() {
			CG.List<T> list = new CG.List<T>(Elements);

			if (Root != null) {
				InOrder(Root, list);
			}

			return list;
		}

		public void PostOrder(N node, CG.List<T> list) {
			m_postorder(node, list);
		}

		public CG.List<T> PostOrder() {
			CG.List<T> list = new CG.List<T>(Elements);

			if (Root != null) {
				PostOrder(Root, list);
			}

			return list;
		}

		public N Find(T value, N node) {
			if (node == null) {
				return null;
			}

			int comp = Compare(value, node.Value);

			if (comp < 0) {
				return Find(value, node.LChild);
			}

			if (comp > 0) {
				return Find(value, node.RChild);
			}

			return node;
		}

		public N Find(T value) {
			return Find(value, Root);
		}

		public void Remove(T value) {
			N node = Find(value);

			if (node != null) {
				Remove(node);
				Elements -= 1;
			}
		}

		public CG.List<T> Range(T lower, T upper) {
			return m_range(lower, upper);
		}

		/// <summary>
		/// Returns an inorder traversal of this Tree according to the
		/// doubly-linked list, rather than the binary search tree.  This is a
		/// faster method than the traditional BST inorder traversal, and is
		/// useful for debugging. </summary>
		///
		/// <returns>
		/// An inorder list of all the elements in this Tree </returns>
		public CG.List<T> DllDump() {
			CG.List<T> dump = new CG.List<T>(Elements);

			N curr = Smallest;
			while (curr != null) {
				dump.Add(curr.Value);

				N node = curr;
				while ((node = node.Eq) != null) {
					dump.Add(node.Value);
				}

				curr = curr.Gt;
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
			N node = Biggest;

			if (node != null) {
				Remove(node);
				return node.Value;
			}

			return default (T);
		}
	}
}

